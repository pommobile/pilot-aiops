package coverages.aiops.ibm.com;

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
			@ConfigProperty(name = "coverages.schema.create", defaultValue = "true") boolean schemaCreate) {
		this.client = client;
		this.schemaCreate = schemaCreate;
	}

	void onStart(@Observes StartupEvent ev) {
		if (schemaCreate) {
			initdb();
		}
	}

	private void initdb() {
		client.query("DROP TABLE IF EXISTS coverages").execute()
				.flatMap(r -> client.query("CREATE TABLE coverages (id SERIAL PRIMARY KEY, name TEXT NOT NULL)")
						.execute())
				.flatMap(r -> client.query("INSERT INTO coverages (name) VALUES ('Fire')").execute())
				.flatMap(r -> client.query("INSERT INTO coverages (name) VALUES ('Flooding')").execute())
				.flatMap(r -> client.query("INSERT INTO coverages (name) VALUES ('Water damage')").execute())
				.flatMap(r -> client.query("INSERT INTO coverages (name) VALUES ('Business interruption')").execute())
				.flatMap(r -> client.query("INSERT INTO coverages (name) VALUES ('Mortgage protection')").execute())
				.flatMap(r -> client.query("INSERT INTO coverages (name) VALUES ('Collision')").execute())
				.flatMap(r -> client.query("INSERT INTO coverages (name) VALUES ('Theft')").execute()).await()
				.indefinitely();
	}
}
