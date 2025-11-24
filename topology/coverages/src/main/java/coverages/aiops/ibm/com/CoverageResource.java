package coverages.aiops.ibm.com;

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

@Path("coverages")
public class CoverageResource {

	private final Pool client;

	public CoverageResource(Pool client) {
		this.client = client;
	}

	@GET
	public Multi<Coverage> get() {
		return Coverage.findAll(client);
	}

	@GET
	@Path("{id}")
	public Uni<Response> getSingle(Long id) {
		return Coverage.findById(client, id).onItem()
				.transform(contract -> contract != null ? Response.ok(contract) : Response.status(Status.NOT_FOUND))
				.onItem().transform(ResponseBuilder::build);
	}

	@GET
	@Path("{name}")
	public Uni<Response> getSingle(String name) {
		return Coverage.findByName(client, name).onItem()
				.transform(contract -> contract != null ? Response.ok(contract) : Response.status(Status.NOT_FOUND))
				.onItem().transform(ResponseBuilder::build);
	}

	@POST
	public Uni<Response> create(Coverage coverage) {
		return coverage.save(client).onItem().transform(id -> URI.create("/coverages/" + id)).onItem()
				.transform(uri -> Response.created(uri).build());
	}

	@DELETE
	@Path("{id}")
	public Uni<Response> delete(Long id) {
		return Coverage.delete(client, id).onItem().transform(deleted -> deleted ? Status.NO_CONTENT : Status.NOT_FOUND)
				.onItem().transform(status -> Response.status(status).build());
	}
}
