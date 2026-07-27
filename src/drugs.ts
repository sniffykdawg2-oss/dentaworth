export type DrugEntry = {
  name: string;
  category: string;
  note: string;
};

/**
 * Real, commonly recognized medication names used in dentistry, grouped by
 * general category. Intentionally excludes dosing, pricing, or clinical
 * guidance — this is a directory, not medical advice. Full write-ups per
 * drug are a later content pass.
 */
export const drugDirectory: DrugEntry[] = [
  { name: "Acetaminophen", category: "Pain reliever", note: "Commonly used for mild to moderate dental pain." },
  { name: "Amoxicillin", category: "Antibiotic", note: "Frequently prescribed for dental infections and prevention before certain procedures." },
  { name: "Articaine", category: "Local anesthetic", note: "Injectable numbing agent used during dental procedures." },
  { name: "Azithromycin", category: "Antibiotic", note: "Alternative antibiotic option for patients with penicillin allergies." },
  { name: "Benzocaine", category: "Topical anesthetic", note: "Numbing gel applied to gums before injections." },
  { name: "Chlorhexidine", category: "Antiseptic rinse", note: "Prescription mouth rinse used to reduce plaque and gum inflammation." },
  { name: "Clindamycin", category: "Antibiotic", note: "Often used for dental infections in patients allergic to penicillin." },
  { name: "Clove oil (Eugenol)", category: "Dental analgesic", note: "Used in some temporary dental materials and topical relief products." },
  { name: "Dexamethasone", category: "Corticosteroid", note: "Sometimes used to reduce swelling after oral surgery." },
  { name: "Doxycycline", category: "Antibiotic", note: "Used for certain periodontal infections." },
  { name: "Epinephrine", category: "Vasoconstrictor", note: "Combined with local anesthetics to prolong numbing and reduce bleeding." },
  { name: "Fluoride (sodium fluoride)", category: "Preventive treatment", note: "Applied in-office or prescribed to help prevent tooth decay." },
  { name: "Hydrocodone", category: "Opioid pain reliever", note: "Prescribed in limited cases for short-term pain after oral surgery." },
  { name: "Hydrogen peroxide", category: "Antiseptic", note: "Used in some rinses and whitening products." },
  { name: "Ibuprofen", category: "NSAID pain reliever", note: "Commonly recommended for dental pain and swelling." },
  { name: "Lidocaine", category: "Local anesthetic", note: "One of the most common numbing agents used in dental injections." },
  { name: "Mepivacaine", category: "Local anesthetic", note: "Local anesthetic option often used for shorter procedures." },
  { name: "Metronidazole", category: "Antibiotic", note: "Often paired with other antibiotics for certain gum infections." },
  { name: "Naproxen", category: "NSAID pain reliever", note: "Longer-acting alternative to ibuprofen for dental pain." },
  { name: "Nitrous oxide", category: "Sedation", note: "Inhaled sedation used to ease anxiety during procedures." },
  { name: "Penicillin", category: "Antibiotic", note: "Long-standing first-line antibiotic for many dental infections." },
  { name: "Prednisone", category: "Corticosteroid", note: "Occasionally used short-term for significant swelling." },
  { name: "Triamcinolone", category: "Topical corticosteroid", note: "Applied to canker sores and other mouth irritations." },
].sort((a, b) => a.name.localeCompare(b.name));

export const drugDirectoryDisclaimer =
  "This directory lists medication names patients commonly encounter in dental care. It is general information only, not medical advice, dosing guidance, or a prescribing recommendation. Always follow the specific instructions your dentist, physician, or pharmacist gives you.";
