export type DrugEntry = {
  name: string;
  category: string;
  note: string;
  imageUrl: string;
  imageAlt: string;
  whereToGet: string;
  askAbout: string;
};

const medicineImage =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80";
const dentalImage =
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80";
const rinseImage =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80";
const syringeImage =
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80";
const pharmacyImage =
  "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=900&q=80";

function detailsFor(category: string) {
  if (category.toLowerCase().includes("anesthetic")) {
    return {
      imageUrl: syringeImage,
      imageAlt: "Dental anesthetic supplies in a clinical setting",
      whereToGet: "Usually provided directly by the dental office during a procedure.",
      askAbout: "Ask how long numbness should last and whether your health history changes the plan.",
    };
  }

  if (category.toLowerCase().includes("rinse") || category.toLowerCase().includes("antiseptic")) {
    return {
      imageUrl: rinseImage,
      imageAlt: "Oral care bottles arranged on a counter",
      whereToGet: "Prescription rinses come from a dentist or physician; some antiseptic products are sold over the counter.",
      askAbout: "Ask how often to use it, what to avoid afterward, and when to stop.",
    };
  }

  if (category.toLowerCase().includes("sedation")) {
    return {
      imageUrl: dentalImage,
      imageAlt: "Dental operatory prepared for patient care",
      whereToGet: "Managed by the dental office as part of an appointment, not picked up like a normal prescription.",
      askAbout: "Ask about fees, ride requirements, recovery time, and whether it is included in the estimate.",
    };
  }

  if (category.toLowerCase().includes("preventive") || category.toLowerCase().includes("analgesic")) {
    return {
      imageUrl: dentalImage,
      imageAlt: "Dental care supplies in a clean treatment room",
      whereToGet: "May be applied in-office, prescribed by a clinician, or purchased over the counter depending on the product.",
      askAbout: "Ask whether it is for short-term relief, prevention, or part of a specific treatment plan.",
    };
  }

  if (category.toLowerCase().includes("antibiotic") || category.toLowerCase().includes("corticosteroid")) {
    return {
      imageUrl: pharmacyImage,
      imageAlt: "Pharmacy shelves with prescription medication containers",
      whereToGet: "Usually requires a prescription filled at a pharmacy.",
      askAbout: "Ask about allergies, interactions, timing, and whether you should finish the full course.",
    };
  }

  return {
    imageUrl: medicineImage,
    imageAlt: "Assorted medication tablets in a clinical container",
    whereToGet: "Often available over the counter or by prescription depending on strength and use.",
    askAbout: "Ask your dentist, physician, or pharmacist what is appropriate for your situation.",
  };
}

function drug(name: string, category: string, note: string): DrugEntry {
  return {
    name,
    category,
    note,
    ...detailsFor(category),
  };
}

/**
 * Real, commonly recognized medication names used in dentistry, grouped by
 * general category. Intentionally excludes dosing, pricing, or clinical
 * guidance — this is a directory, not medical advice. Full write-ups per
 * drug are a later content pass.
 */
export const drugDirectory: DrugEntry[] = [
  drug("Acetaminophen", "Pain reliever", "Commonly used for mild to moderate dental pain."),
  drug("Amoxicillin", "Antibiotic", "Frequently prescribed for dental infections and prevention before certain procedures."),
  drug("Articaine", "Local anesthetic", "Injectable numbing agent used during dental procedures."),
  drug("Azithromycin", "Antibiotic", "Alternative antibiotic option for patients with penicillin allergies."),
  drug("Benzocaine", "Topical anesthetic", "Numbing gel applied to gums before injections."),
  drug("Chlorhexidine", "Antiseptic rinse", "Prescription mouth rinse used to reduce plaque and gum inflammation."),
  drug("Clindamycin", "Antibiotic", "Often used for dental infections in patients allergic to penicillin."),
  drug("Clove oil (Eugenol)", "Dental analgesic", "Used in some temporary dental materials and topical relief products."),
  drug("Dexamethasone", "Corticosteroid", "Sometimes used to reduce swelling after oral surgery."),
  drug("Doxycycline", "Antibiotic", "Used for certain periodontal infections."),
  drug("Epinephrine", "Vasoconstrictor", "Combined with local anesthetics to prolong numbing and reduce bleeding."),
  drug("Fluoride (sodium fluoride)", "Preventive treatment", "Applied in-office or prescribed to help prevent tooth decay."),
  drug("Hydrocodone", "Opioid pain reliever", "Prescribed in limited cases for short-term pain after oral surgery."),
  drug("Hydrogen peroxide", "Antiseptic", "Used in some rinses and whitening products."),
  drug("Ibuprofen", "NSAID pain reliever", "Commonly recommended for dental pain and swelling."),
  drug("Lidocaine", "Local anesthetic", "One of the most common numbing agents used in dental injections."),
  drug("Mepivacaine", "Local anesthetic", "Local anesthetic option often used for shorter procedures."),
  drug("Metronidazole", "Antibiotic", "Often paired with other antibiotics for certain gum infections."),
  drug("Naproxen", "NSAID pain reliever", "Longer-acting alternative to ibuprofen for dental pain."),
  drug("Nitrous oxide", "Sedation", "Inhaled sedation used to ease anxiety during procedures."),
  drug("Penicillin", "Antibiotic", "Long-standing first-line antibiotic for many dental infections."),
  drug("Prednisone", "Corticosteroid", "Occasionally used short-term for significant swelling."),
  drug("Triamcinolone", "Topical corticosteroid", "Applied to canker sores and other mouth irritations."),
].sort((a, b) => a.name.localeCompare(b.name));

export const drugDirectoryDisclaimer =
  "This directory lists medication names patients commonly encounter in dental care. It is general information only, not medical advice, dosing guidance, or a prescribing recommendation. Always follow the specific instructions your dentist, physician, or pharmacist gives you.";
