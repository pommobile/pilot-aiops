package contracts.aiops.ibm.com;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.sqlclient.Pool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.RowSet;
import io.vertx.mutiny.sqlclient.Tuple;

public class Contract {

	public Long id;

	public String name;

	public String people;

	public String coverage;

	public Contract() {
	}

	public Contract(String name, String people, String coverage) {
		this.name = name;
		this.people = people;
		this.coverage = coverage;
	}

	public Contract(Long id, String name, String people, String coverage) {
		this.id = id;
		this.name = name;
		this.people = people;
		this.coverage = coverage;
	}

	public static Multi<Contract> findAll(Pool client) {
		return client.query("SELECT id, name, people, coverage FROM contracts ORDER BY name ASC").execute().onItem()
				.transformToMulti(set -> Multi.createFrom().iterable(set)).onItem().transform(Contract::from);
	}

	public static Uni<Contract> findById(Pool client, Long id) {
		return client.preparedQuery("SELECT id, name, people, coverage FROM contracts WHERE id = $1")
				.execute(Tuple.of(id)).onItem().transform(RowSet::iterator).onItem()
				.transform(iterator -> iterator.hasNext() ? from(iterator.next()) : null);
	}

	public Uni<Long> save(Pool client) {
		return client.preparedQuery("INSERT INTO contracts (name, people, coverage) VALUES ($1, $2, $3) RETURNING id")
				.execute(Tuple.of(name, people, coverage)).onItem()
				.transform(pgRowSet -> pgRowSet.iterator().next().getLong("id"));
	}

	public static Uni<Boolean> delete(Pool client, Long id) {
		return client.preparedQuery("DELETE FROM contracts WHERE id = $1").execute(Tuple.of(id)).onItem()
				.transform(pgRowSet -> pgRowSet.rowCount() == 1);
	}

	private static Contract from(Row row) {
		return new Contract(row.getLong("id"), row.getString("name"), row.getString("people"),
				row.getString("coverage"));
	}
}
