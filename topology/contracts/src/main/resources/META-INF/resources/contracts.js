function refresh() {
    $.get('/contracts', function (contracts) {
        var list = '';
        (contracts || []).forEach(function (contract) {
            list = list
                + '<tr>'
                + '<td>' + contract.id + '</td>'
				+ '<td>' + contract.name + '</td>'
                + '<td><a href="#" onclick="showPeople(\'' + contract.people + '\')">' + contract.people + '</a></td>'
				+ '<td><a href="#" onclick="showCoverage(\'' + contract.coverage + '\')">' + contract.coverage + '</a></td>'
                + '<td><a href="#" onclick="deleteContract(' + contract.id + ')">Delete</a></td>'
                + '</tr>'
        });
        if (list.length > 0) {
            list = ''
                + '<table border="1"><thead><th>Id</th><th>Contract</th><th>People</th><th>Coverage</th><th></th></thead>'
                + list
                + '</table>';
        } else {
            list = "No contracts in database"
        }
        $('#all-contracts').html(list);
    });
}

function deleteContract(id) {
    $.ajax('/contracts/' + id, {method: 'DELETE'}).then(refresh);
}

function showPeople(name) {
    $.ajax('/contracts/people/' + name, {method: 'GET'})
	.done(function(response) {$('#result').val(response.id)})
	.fail(function(jqXHR, textStatus, errorThrown) { alert('Error fetching data: ' + textStatus + " " + errorThrown)});
}

function showCoverage(name) {
    $.ajax('/contracts/coverages/' + name, {method: 'GET'})
	.done(function(response) {$('#result').val(response.id)})
	.fail(function(jqXHR, textStatus, errorThrown) { alert('Error fetching data: ' + textStatus + " " + errorThrown)});
}

$(document).ready(function () {
    $('#create-contract-button').click(function () {
		var contractName = $('#contract-name').val();
        var peopleName = $('#people-name').val();
		var coverageName = $('#coverage-name').val();
        $.post({
            url: '/contracts',
            contentType: 'application/json',
            data: JSON.stringify({name: contractName, people: peopleName, coverage: coverageName})
        }).then(refresh);
    });
    refresh();
});
