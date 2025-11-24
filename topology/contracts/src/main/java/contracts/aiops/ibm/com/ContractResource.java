package contracts.aiops.ibm.com;

import java.net.URI;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.sqlclient.Pool;
import jakarta.inject.Inject;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;
import jakarta.ws.rs.core.Response.Status;

@Path("contracts")
public class ContractResource {

	@Inject
	@RestClient
	PeopleClient peopleClient;

	@Inject
	@RestClient
	CoveragesClient coveragesClient;

	private final Pool client;

	public ContractResource(Pool client) {
		this.client = client;
	}

	@GET
	public Multi<Contract> get() {
		return Contract.findAll(client);
	}

	@GET
	@Path("{id}")
	public Uni<Response> getSingle(Long id) {
		return Contract.findById(client, id).onItem()
				.transform(contract -> contract != null ? Response.ok(contract) : Response.status(Status.NOT_FOUND))
				.onItem().transform(ResponseBuilder::build);
	}

	@GET
	@Path("/people/{name}")
	public Uni<Response> getSinglePeople(String name) {
		return peopleClient.getSingle(name);
	}

	@GET
	@Path("/coverages/{name}")
	public Uni<Response> getSingleCoverage(String name) {
		return coveragesClient.getSingle(name);
	}

	@POST
	public Uni<Response> create(Contract contract) {
		return contract.save(client).onItem().transform(id -> URI.create("/contracts/" + id)).onItem()
				.transform(uri -> Response.created(uri).build());
	}

	@DELETE
	@Path("{id}")
	public Uni<Response> delete(Long id) {
		return Contract.delete(client, id).onItem().transform(deleted -> deleted ? Status.NO_CONTENT : Status.NOT_FOUND)
				.onItem().transform(status -> Response.status(status).build());
	}
}
