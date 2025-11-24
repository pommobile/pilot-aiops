package people.aiops.ibm.com;

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
			@ConfigProperty(name = "people.schema.create", defaultValue = "true") boolean schemaCreate) {
		this.client = client;
		this.schemaCreate = schemaCreate;
	}

	void onStart(@Observes StartupEvent ev) {
		if (schemaCreate) {
			initdb();
		}
	}

	private void initdb() {
		client.query("DROP TABLE IF EXISTS people").execute()
				.flatMap(r -> client.query("CREATE TABLE people (id SERIAL PRIMARY KEY, name TEXT NOT NULL)")
						.execute())
				.flatMap(r -> client.query("INSERT INTO people (name) VALUES ('Home owner 1')").execute())
				.flatMap(r -> client.query("INSERT INTO people (name) VALUES ('Home owner 2')").execute())
				.flatMap(r -> client.query("INSERT INTO people (name) VALUES ('Business man 1')").execute())
				.flatMap(r -> client.query("INSERT INTO people (name) VALUES ('Car driver 1')").execute()).await()
				.indefinitely();
	}
}
