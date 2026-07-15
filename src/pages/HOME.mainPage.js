import wixData from 'wix-data';
import wixWindowFrontend from 'wix-window-frontend';

$w.onReady(function () {
    
    // 1. Collapse elements if on Desktop
    if (wixWindowFrontend.formFactor === "Desktop") {
        $w("#repeater1").collapse(); // REPLACE #repeater1 with your actual Repeater ID
        $w("#countyInput").collapse(); // This is your Search Bar ID
    }

    // 2. Ensure the dataset is ready before doing anything
    $w("#dataset6").onReady(() => {
        console.log("Dataset #dataset6 is ready");
    });

    // 3. Filtering logic
    $w("#countyInput").onInput((event) => {
        let searchValue = $w("#countyInput").value;

        if (searchValue.length > 0) {
            $w("#dataset6").setFilter(wixData.filter()
                .contains("title", searchValue)
            );
        } else {
            $w("#dataset6").setFilter(wixData.filter());
        }
    });
}); 