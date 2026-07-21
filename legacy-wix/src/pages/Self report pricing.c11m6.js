import wixData from 'wix-data';

$w.onReady(function () {
    // 1. Dynamic Dropdown Logic
    function linkInputToDropdown(inputID, dropdownID) {
        const input = $w(inputID);
        const dropdown = $w(dropdownID);
        input.onInput(() => {
            dropdown.required = (input.value && input.value.length > 0);
            if (!input.value) { dropdown.value = null; }
        });
    }

    linkInputToDropdown("#input8", "#dropdown2");
    linkInputToDropdown("#input9", "#dropdown3");
    linkInputToDropdown("#input10", "#dropdown4");
    linkInputToDropdown("#input11", "#dropdown5");
    linkInputToDropdown("#input12", "#dropdown6");

    // 2. Manual Submission (This now works because the button is NOT connected to 'Submit')
    $w("#button1").onClick(async () => {
        console.log("Submit clicked. Validating...");
        
        try {
            // This triggers Wix's internal validation for all 'Required' fields automatically
            await $w("#dataset1").save();
            console.log("Submission successful!");
            
            // Refresh calculations after save
            calculateAllAverages();
        } catch (err) {
            console.error("Submission failed. Check for missing required fields.", err);
        }
    });

    // 3. Initial calculation
    calculateAllAverages();
});

async function calculateAllAverages() {
    const results = await wixData.query("SelfReportedProcedurePrices").find();
    const data = results.items;
    if (data.length === 0) return;

    const procedures = [
        { key: "exam", id: "#textExam" }, { key: "cleaning", id: "#textCleaning" },
        { key: "xRays", id: "#textXRays" }, { key: "extraction", id: "#textExtraction" },
        { key: "crown", id: "#textCrown" }, { key: "rootCanal", id: "#textRootCanal" },
        { key: "filling", id: "#textFilling" }, { key: "implant", id: "#textImplant" },
        { key: "whitening", id: "#textWhitening" }, { key: "invisalign", id: "#textInvisalign" }
    ];

    procedures.forEach(proc => {
        const validValues = data.map(item => Number(item[proc.key])).filter(val => !isNaN(val) && val > 0);
        if (validValues.length > 0 && $w(proc.id)) {
            const avg = (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(2);
            $w(proc.id).text = `$${avg}`;
        }
    });
} 