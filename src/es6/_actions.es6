/* jshint esversion: 6 */
"strict mode";

import navigation from "../../src/es6/_navigation.es6";
var NAV = new navigation(),
    page = NAV.get_page();

class actions {
    execute() {
        if(page == "ontology" || page == "terms") {
            this.edit_button_action();
        }
    }

    edit_button_action() {
        // Edit button action
        $("#page_info .btn-mini").on("click", (e) => {
            console.warn("mmm");
            // let $dd = $(e.target).closest("dd"),
            //     $dd2 = $dd.clone();
            //
            // $dd.html(
            //     $('<form>', {"method": "post", "enctype": "multipart/form-data", "action": ""}).append(
            //         $('<div>', {"class": "row"}).append(
            //             $('<div>', {"class": "input-field col s12"}).append(
            //                 $('<textarea>', {"class": "materialize-textarea", "name": "value"})
            //             )
            //         )
            //     ).append(
            //         $('<div>', {"class": "row"}).append(
            //             $('<div>', {"class": "col s12"}).append(
            //                 $('<a>', {"href": "javascript:;", "class": "grey-text left"}).text("‹ Cancel").on("click", () => {
            //                     $dd.html($dd2.html());
            //                 })
            //             ).append(
            //                 $('<a>', {"href": "javascript:;", "class": "btn btn-flat btn-highlight right"}).text("Save").on("click", () => {
            //                     console.log("Okay!");
            //                 })
            //             )
            //         )
            //     )
            // );
            // console.log();
        });
    }
}

export default actions;
