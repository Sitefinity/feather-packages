$(document).ready(function () {
    $(".js-nav-fixed").fixit({
        top: 0,
        fixClass: "is-fixed",
        dummyClass: "fixed-dummy",
        classOnly: true,
        renderDummy: true
    });
});