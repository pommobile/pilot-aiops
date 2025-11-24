package contracts.aiops.ibm.com;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@RegisterRestClient
@Path("/people")
public interface PeopleClient {

	@GET
	@Path("/{name}")
	public Uni<Response> getSingle(@PathParam("name") String name);
}
