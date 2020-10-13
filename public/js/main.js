$(function() {
    if ($("textarea#ta").length) {
        //alert("Test")
        CKEDITOR.replace("ta");
    }

    $("a.confirmDeletion").on("click", function () {
        if (!confirm("Confirm deletion"))
            return false;
    });
})
