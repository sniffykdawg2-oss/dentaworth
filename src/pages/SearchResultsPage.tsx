import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Search, Stethoscope, UserRound } from "lucide-react";
import { countyCostRows, procedures, ProcedureKey } from "../content";
import { getSearchFiltersFromUrl } from "../nav";
import { subscribeToPublishedDentistProfiles, subscribeToPublishedPriceRanges } from "../backend/repository";
import { DentistProfileRecord, PriceRangeRecord } from "../backend/schema";
import { buildCountyRowsFromPriceRanges, getProcedureLabel } from "../pageHelpers";

function resolveProcedureKey(rawTreatment: string): ProcedureKey | null {
  const normalized = rawTreatment.trim().toLowerCase();
  if (!normalized) return null;
  const match = procedures.find((procedure) => procedure.label.toLowerCase() === normalized || procedure.label.toLowerCase().includes(normalized));
  return match?.key ?? null;
}

function resolveCountyName(rawCounty: string, availableCounties: string[]): string | null {
  const normalized = rawCounty.trim().toLowerCase();
  if (!normalized) return null;
  const match = availableCounties.find((county) => county.toLowerCase() === normalized || county.toLowerCase().includes(normalized));
  return match ?? null;
}

export function SearchResultsPage({ navigate, routeVersion }: { navigate: (href: string) => void; routeVersion: number }) {
  const [rawFilters, setRawFilters] = useState(getSearchFiltersFromUrl);
  const [refineQuery, setRefineQuery] = useState("");
  const [publishedPriceRanges, setPublishedPriceRanges] = useState<Array<{ id: string } & PriceRangeRecord>>([]);
  const [publishedDentists, setPublishedDentists] = useState<Array<{ id: string } & DentistProfileRecord>>([]);

  useEffect(() => {
    setRawFilters(getSearchFiltersFromUrl());
    setRefineQuery("");
  }, [routeVersion]);

  useEffect(() => {
    try {
      return subscribeToPublishedPriceRanges(setPublishedPriceRanges);
    } catch (error) {
      console.warn("Published price ranges are unavailable.", error);
      return undefined;
    }
  }, []);

  useEffect(() => {
    try {
      return subscribeToPublishedDentistProfiles(setPublishedDentists);
    } catch (error) {
      console.warn("Published dentist profiles are unavailable.", error);
      return undefined;
    }
  }, []);

  const guideRows = useMemo(
    () => buildCountyRowsFromPriceRanges(publishedPriceRanges) || countyCostRows,
    [publishedPriceRanges],
  );
  const availableCounties = useMemo(() => guideRows.map((row) => row.county).filter((county) => county !== "Statewide average"), [guideRows]);

  const resolvedProcedureKey = resolveProcedureKey(rawFilters.treatment);
  const resolvedCounty = resolveCountyName(rawFilters.county, availableCounties);

  const matchingRows = useMemo(() => {
    const base = resolvedCounty ? guideRows.filter((row) => row.county === resolvedCounty) : guideRows.filter((row) => row.county !== "Statewide average");
    return base;
  }, [guideRows, resolvedCounty]);

  const filteredRows = useMemo(() => {
    const normalized = refineQuery.trim().toLowerCase();
    if (!normalized) return matchingRows;

    return matchingRows.filter((row) => {
      const dentistsForCounty = publishedDentists.filter((profile) => profile.county === row.county);
      const haystack = [
        row.county,
        row.rating,
        ...procedures.map((procedure) => procedure.label),
        ...procedures.map((procedure) => row[procedure.key]),
        ...dentistsForCounty.map((profile) => profile.practiceName),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [matchingRows, refineQuery, publishedDentists]);

  const treatmentLabel = resolvedProcedureKey ? getProcedureLabel(resolvedProcedureKey) : rawFilters.treatment || "All treatments";
  const countyLabel = resolvedCounty || (rawFilters.county ? rawFilters.county : "Florida (all counties)");

  return (
    <section className="search-results-page">
      <div className="search-results-header">
        <h1>
          Showing results for: <span>{treatmentLabel}</span> in <span>{countyLabel}</span>
        </h1>
        <button className="text-button" type="button" onClick={() => navigate("/")}>
          Edit your search
        </button>
      </div>

      <label className="search-refine-bar">
        <Search size={19} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search these results by county, provider, or procedure"
          value={refineQuery}
          onChange={(event) => setRefineQuery(event.target.value)}
        />
      </label>

      {filteredRows.length > 0 ? (
        <div className="result-list">
          {filteredRows.map((row) => {
            const dentistsForCounty = publishedDentists.filter((profile) => profile.county === row.county);
            const primaryDentist = dentistsForCounty[0];

            return (
              <article className="result-row" key={row.county}>
                <div className="result-field result-field-procedure">
                  <span className="result-field-label">Procedure</span>
                  {resolvedProcedureKey ? (
                    <span className="result-field-value">
                      <Stethoscope size={16} aria-hidden="true" />
                      {getProcedureLabel(resolvedProcedureKey)}
                    </span>
                  ) : (
                    <span className="result-field-value">All procedures</span>
                  )}
                </div>
                <div className="result-field">
                  <span className="result-field-label">Location</span>
                  <span className="result-field-value">
                    <MapPin size={16} aria-hidden="true" />
                    {row.county}, FL
                  </span>
                </div>
                <div className="result-field">
                  <span className="result-field-label">Clinic / provider</span>
                  <span className="result-field-value">
                    <UserRound size={16} aria-hidden="true" />
                    {primaryDentist ? primaryDentist.practiceName : "Provider details coming soon"}
                  </span>
                </div>
                <div className="result-field result-field-price">
                  <span className="result-field-label">Price range</span>
                  <span className="result-field-value result-price">
                    {resolvedProcedureKey
                      ? `$${row[resolvedProcedureKey] || "Not yet available"}`
                      : `${procedures.length} ranges`}
                  </span>
                </div>
                <div className="result-field result-field-rating">
                  <span className="result-field-label">Rating</span>
                  <span className="result-field-value">{row.rating}</span>
                </div>
                <button className="button primary compact" type="button" onClick={() => navigate("/get-care-now")}>
                  Get care
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
                {!resolvedProcedureKey && (
                  <dl className="result-price-breakdown" aria-label={`${row.county} procedure price ranges`}>
                    {procedures.map((procedure) => (
                      <div key={procedure.key}>
                        <dt>{procedure.label}</dt>
                        <dd>${row[procedure.key]}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching results</h3>
          <p>Try clearing the refine search box, or edit your search to a different county or treatment.</p>
        </div>
      )}
    </section>
  );
}
