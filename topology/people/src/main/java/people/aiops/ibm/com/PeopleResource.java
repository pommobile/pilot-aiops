package people.aiops.ibm.com;

import java.net.URI;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.sqlclient.Pool;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;
import jakarta.ws.rs.core.Response.Status;

@Path("people")
public class PeopleResource {

	private final Pool client;

	public PeopleResource(Pool client) {
		this.client = client;
	}

	@GET
	public Multi<People> get() {
		return People.findAll(client);
	}

	@GET
	@Path("{id}")
	public Uni<Response> getSingle(Long id) {
		return People.findById(client, id).onItem()
				.transform(people -> people != null ? Response.ok(people) : Response.status(Status.NOT_FOUND)).onItem()
				.transform(ResponseBuilder::build);
	}

	@GET
	@Path("{name}")
	public Uni<Response> getSingle(String name) {
		return People.findByName(client, name).onItem()
				.transform(people -> people != null ? Response.ok(people) : Response.status(Status.NOT_FOUND)).onItem()
				.transform(ResponseBuilder::build);
	}

	@POST
	public Uni<Response> create(People people) {
		return people.save(client).onItem().transform(id -> URI.create("/people/" + id)).onItem()
				.transform(uri -> Response.created(uri).build());
	}

	@DELETE
	@Path("{id}")
	public Uni<Response> delete(Long id) {
		return People.delete(client, id).onItem().transform(deleted -> deleted ? Status.NO_CONTENT : Status.NOT_FOUND)
				.onItem().transform(status -> Response.status(status).build());
	}
}
