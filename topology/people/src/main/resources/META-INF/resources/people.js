function refresh() {
    $.get('/people', function (peoples) {
        var list = '';
        (peoples || []).forEach(function (people) {
            list = list
                + '<tr>'
                + '<td>' + people.id + '</td>'
                + '<td>' + people.name + '</td>'
                + '<td><a href="#" onclick="deletePeople(' + people.id + ')">Delete</a></td>'
                + '</tr>'
        });
        if (list.length > 0) {
            list = ''
                + '<table><thead><th>Id</th><th>Name</th><th></th></thead>'
                + list
                + '</table>';
        } else {
            list = "No people in database"
        }
        $('#all-people').html(list);
    });
}

function deletePeople(id) {
    $.ajax('/people/' + id, {method: 'DELETE'}).then(refresh);
}


$(document).ready(function () {

    $('#create-people-button').click(function () {
        var peopleName = $('#people-name').val();
        $.post({
            url: '/people',
            contentType: 'application/json',
            data: JSON.stringify({name: peopleName})
        }).then(refresh);
    });

    refresh();
});
