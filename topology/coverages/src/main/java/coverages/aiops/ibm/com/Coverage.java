package coverages.aiops.ibm.com;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.sqlclient.Pool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.RowSet;
import io.vertx.mutiny.sqlclient.Tuple;

public class Coverage {

	public Long id;

	public String name;

	public Coverage() {
	}

	public Coverage(String name) {
		this.name = name;
	}

	public Coverage(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	public static Multi<Coverage> findAll(Pool client) {
		return client.query("SELECT id, name FROM coverages ORDER BY name ASC").execute().onItem()
				.transformToMulti(set -> Multi.createFrom().iterable(set)).onItem().transform(Coverage::from);
	}

	public static Uni<Coverage> findById(Pool client, Long id) {
		return client.preparedQuery("SELECT id, name FROM coverages WHERE id = $1").execute(Tuple.of(id)).onItem()
				.transform(RowSet::iterator).onItem()
				.transform(iterator -> iterator.hasNext() ? from(iterator.next()) : null);
	}

	public static Uni<Coverage> findByName(Pool client, String name) {
		return client.preparedQuery("SELECT id, name FROM coverages WHERE name = $1").execute(Tuple.of(name)).onItem()
				.transform(RowSet::iterator).onItem()
				.transform(iterator -> iterator.hasNext() ? from(iterator.next()) : null);
	}

	public Uni<Long> save(Pool client) {
		return client.preparedQuery("INSERT INTO coverages (name) VALUES ($1) RETURNING id").execute(Tuple.of(name))
				.onItem().transform(pgRowSet -> pgRowSet.iterator().next().getLong("id"));
	}

	public static Uni<Boolean> delete(Pool client, Long id) {
		return client.preparedQuery("DELETE FROM coverages WHERE id = $1").execute(Tuple.of(id)).onItem()
				.transform(pgRowSet -> pgRowSet.rowCount() == 1);
	}

	private static Coverage from(Row row) {
		return new Coverage(row.getLong("id"), row.getString("name"));
	}
}
