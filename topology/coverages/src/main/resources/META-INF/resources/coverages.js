function refresh() {
    $.get('/coverages', function (coverages) {
        var list = '';
        (coverages || []).forEach(function (coverage) {
            list = list
                + '<tr>'
                + '<td>' + coverage.id + '</td>'
                + '<td>' + coverage.name + '</td>'
                + '<td><a href="#" onclick="deleteCoverage(' + coverage.id + ')">Delete</a></td>'
                + '</tr>'
        });
        if (list.length > 0) {
            list = ''
                + '<table><thead><th>Id</th><th>Name</th><th></th></thead>'
                + list
                + '</table>';
        } else {
            list = "No coverages in database"
        }
        $('#all-coverages').html(list);
    });
}

function deleteCoverage(id) {
    $.ajax('/coverages/' + id, {method: 'DELETE'}).then(refresh);
}


$(document).ready(function () {
    $('#create-coverage-button').click(function () {
		var contractName = $('#coverage-name').val();
        $.post({
            url: '/coverages',
            contentType: 'application/json',
            data: JSON.stringify({name: contractName})
        }).then(refresh);
    });
    refresh();
});
