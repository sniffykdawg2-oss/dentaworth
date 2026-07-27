export type ProcedureKey =
  | "rootCanal"
  | "xray"
  | "extraction"
  | "crown"
  | "cleaning"
  | "exam"
  | "implant"
  | "filling"
  | "whitening"
  | "invisalign";

export type CountyCostRow = {
  county: string;
  rating: string;
} & Record<ProcedureKey, string>;

export const procedures: Array<{ key: ProcedureKey; label: string }> = [
  { key: "rootCanal", label: "Root canal" },
  { key: "xray", label: "X-ray" },
  { key: "extraction", label: "Extraction" },
  { key: "crown", label: "Crown, ceramic" },
  { key: "cleaning", label: "Cleaning" },
  { key: "exam", label: "Exam" },
  { key: "implant", label: "Implant" },
  { key: "filling", label: "Filling" },
  { key: "whitening", label: "Whitening" },
  { key: "invisalign", label: "Invisalign" },
];

export const treatmentOptions = [
  "Cleaning",
  "Exam",
  "X-ray",
  "Filling",
  "Whitening",
  "Extraction",
  "Root canal",
  "Crown, ceramic",
  "Implant",
  "Invisalign",
];

export const countyCostRows: CountyCostRow[] = [
  {
    county: "Statewide average",
    rating: "4.3",
    rootCanal: "1270 - 1524",
    xray: "65 - 78",
    extraction: "225 - 270",
    crown: "1300 - 1560",
    cleaning: "125 - 150",
    exam: "130 - 160",
    implant: "3400 - 4080",
    filling: "245 - 294",
    whitening: "600 - 720",
    invisalign: "5600 - 6720",
  },
  {
    county: "Alachua",
    rating: "4.75",
    rootCanal: "1345 - 1614",
    xray: "70 - 84",
    extraction: "250 - 300",
    crown: "1350 - 1620",
    cleaning: "100 - 120",
    exam: "125 - 150",
    implant: "3456 - 4147",
    filling: "250 - 300",
    whitening: "525 - 630",
    invisalign: "5200 - 6240",
  },
  {
    county: "Baker",
    rating: "4.45",
    rootCanal: "1209 - 1450",
    xray: "58 - 69",
    extraction: "190 - 228",
    crown: "1150 - 1380",
    cleaning: "120 - 144",
    exam: "95 - 114",
    implant: "2944 - 3532",
    filling: "220 - 264",
    whitening: "425 - 510",
    invisalign: "4500 - 5400",
  },
  {
    county: "Bay County",
    rating: "4.6",
    rootCanal: "1278 - 1533",
    xray: "70 - 84",
    extraction: "235 - 282",
    crown: "1300 - 1560",
    cleaning: "100 - 120",
    exam: "115 - 138",
    implant: "3360 - 4032",
    filling: "245 - 294",
    whitening: "500 - 600",
    invisalign: "5100 - 6120",
  },
  {
    county: "Bradford",
    rating: "4.45",
    rootCanal: "1209 - 1450",
    xray: "58 - 69",
    extraction: "190 - 228",
    crown: "1150 - 1380",
    cleaning: "140 - 168",
    exam: "95 - 114",
    implant: "2944 - 3532",
    filling: "225 - 270",
    whitening: "435 - 522",
    invisalign: "4700 - 5640",
  },
  {
    county: "Brevard",
    rating: "4.7",
    rootCanal: "1323 - 1587",
    xray: "73 - 87",
    extraction: "250 - 300",
    crown: "1450 - 1740",
    cleaning: "175 - 210",
    exam: "125 - 150",
    implant: "3456 - 4147",
    filling: "260 - 312",
    whitening: "575 - 690",
    invisalign: "5600 - 6720",
  },
  {
    county: "Broward",
    rating: "4.8",
    rootCanal: "1368 - 1641",
    xray: "80 - 96",
    extraction: "275 - 330",
    crown: "1750 - 2100",
    cleaning: "95 - 114",
    exam: "135 - 162",
    implant: "3680 - 4416",
    filling: "295 - 354",
    whitening: "725 - 870",
    invisalign: "6300 - 7560",
  },
  {
    county: "Calhoun",
    rating: "4.4",
    rootCanal: "1186 - 1423",
    xray: "55 - 66",
    extraction: "180 - 216",
    crown: "1100 - 1320",
    cleaning: "150 - 180",
    exam: "90 - 108",
    implant: "2880 - 3456",
    filling: "220 - 264",
    whitening: "425 - 510",
    invisalign: "4400 - 5280",
  },
];

export const counties = countyCostRows
  .map((row) => row.county)
  .filter((county) => county !== "Statewide average");

export const disclaimerText =
  "Cash price ranges are estimates only, for informational purposes only. They are not quotations and are non-binding. Price ranges are based on independent estimations and self-reported data. Dentaworth does not verify or guarantee accuracy. Treatment complications may affect pricing.";

/** Each slogan is pre-split into two lines so the hero always reserves the
 * same two-line height — no empty gap for shorter phrases. */
export const heroSlogans: Array<[string, string]> = [
  ["Know before", "you go."],
  ["Own your", "smile."],
  ["Ask before", "you pay."],
  ["Price clarity,", "finally."],
  ["See the range,", "then decide."],
];

export const smileCycleWords = ["Own", "Love", "Maintain", "Protect"];
