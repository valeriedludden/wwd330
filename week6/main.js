function createList(){
    $("#main").append("<div class='listContainer'>" +
        "<div class='listTitle'>" + "<span>" + "To Do List: " +
        "<input class='listName' type='text' placeholder='List Name Here'>" + "</span>" +
        "<span>" + "<i class='listTrashCan far fa-trash-alt'>" + "</i>" + "</span>" +"</div>" +
        "<div class='buttonHeader'>" +
        "<button class='taskButton' onclick='addTask()'>" + "New Task" + "</button>" +
        "<button class='deleteTask' onclick='removeTask()'>" + "Clear completed tasks" + "</button>" + "</div>" +
        "<div class='taskContainer'>" + "</div>");

    $('.listTrashCan').click(function () {
        $(this).parent().parent().parent().animate({
                opacity: 0,
                left: '+=200'}, 800,
            function () {
                $(this).remove();
            });
    });
    $('.listName').on('keydown', function(event) {

        if (event.which === 13) {
            console.log($('.listName').val());

            createListObject($('.listName').val());
        }
    });
}

function addTask() {
    $('.taskContainer').append("<div class='taskList'>" +
        "<div class='checkboxName'>" +
        "<input type='checkbox' class='checkboxClass'>"  +
        "<input class='taskName' type='text' placeholder='Write new task here'>" +
        "</div>" + "<i class='trashCan far fa-trash-alt'>" + "</i>" + "</div>");


    $('.trashCan').click(function () {
        $(this).parent().animate({
            opacity: 0,
            left: '+=200'
        }, 800, function () {
            $(this).remove();
        });
    });
}

function removeTask(){
    $('.checkboxClass').each(function() {
        if (this.checked){
            $(this).parent().parent().remove();}
    });
}