package contracts.aiops.ibm.com;

import io.quarkus.runtime.StartupEvent;
import io.vertx.mutiny.sqlclient.Pool;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

@ApplicationScoped
public class DBInit {

	private final Pool client;
	private final boolean schemaCreate;

	public DBInit(Pool client,
			@ConfigProperty(name = "contracts.schema.create", defaultValue = "true") boolean schemaCreate) {
		this.client = client;
		this.schemaCreate = schemaCreate;
	}

	void onStart(@Observes StartupEvent ev) {
		if (schemaCreate) {
			initdb();
		}
	}

	private void initdb() {
		client.query("DROP TABLE IF EXISTS contracts").execute().flatMap(r -> client.query(
				"CREATE TABLE contracts (id SERIAL PRIMARY KEY, name TEXT NOT NULL, people TEXT NOT NULL, coverage TEXT NOT NULL)")
				.execute())
				.flatMap(r -> client.query(
						"INSERT INTO contracts (name, people, coverage) VALUES ('Home multi-risk insurance HO1', 'Home owner 1', 'Water damage')")
						.execute())
				.flatMap(r -> client.query(
						"INSERT INTO contracts (name, people, coverage) VALUES ('Mortgage insurance HO2', 'Home owner 2', 'Mortgage protection')")
						.execute())
				.flatMap(r -> client.query(
						"INSERT INTO contracts (name, people, coverage) VALUES ('Professional liability insurance BM1', 'Business man 1', 'Business interruption')")
						.execute())
				.flatMap(r -> client.query(
						"INSERT INTO contracts (name, people, coverage) VALUES ('Auto insurance CD1', 'Car driver 1', 'Collision')")
						.execute())
				.await().indefinitely();
	}
}
