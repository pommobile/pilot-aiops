package people.aiops.ibm.com;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.sqlclient.Pool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.RowSet;
import io.vertx.mutiny.sqlclient.Tuple;

public class People {

	public Long id;

	public String name;

	public People() {
	}

	public People(String name) {
		this.name = name;
	}

	public People(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	public static Multi<People> findAll(Pool client) {
		return client.query("SELECT id, name FROM people ORDER BY name ASC").execute().onItem()
				.transformToMulti(set -> Multi.createFrom().iterable(set)).onItem().transform(People::from);
	}

	public static Uni<People> findById(Pool client, Long id) {
		return client.preparedQuery("SELECT id, name FROM people WHERE id = $1").execute(Tuple.of(id)).onItem()
				.transform(RowSet::iterator).onItem()
				.transform(iterator -> iterator.hasNext() ? from(iterator.next()) : null);
	}

	public static Uni<People> findByName(Pool client, String name) {
		return client.preparedQuery("SELECT id, name FROM people WHERE name = $1").execute(Tuple.of(name)).onItem()
				.transform(RowSet::iterator).onItem()
				.transform(iterator -> iterator.hasNext() ? from(iterator.next()) : null);
	}

	public Uni<Long> save(Pool client) {
		return client.preparedQuery("INSERT INTO people (name) VALUES ($1) RETURNING id").execute(Tuple.of(name))
				.onItem().transform(pgRowSet -> pgRowSet.iterator().next().getLong("id"));
	}

	public static Uni<Boolean> delete(Pool client, Long id) {
		return client.preparedQuery("DELETE FROM people WHERE id = $1").execute(Tuple.of(id)).onItem()
				.transform(pgRowSet -> pgRowSet.rowCount() == 1);
	}

	private static People from(Row row) {
		return new People(row.getLong("id"), row.getString("name"));
	}
}
