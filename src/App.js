import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const MY_USER_INFO_FRAGMENT = gql`
  # Basic info (fast)
  fragment UserInfoBasic on UserInfo {
    firstName
    lastName
    email
  }
`;

const MY_PROJECTS_FRAGMENT = gql`
  # Projects (slow)
  fragment UserInfoProjects on UserInfo {
    projects {
      id
      name
      numberOfStars
    }
  }
`;

const TEST_QUERY = gql`
  query MeQuery {
    me {
      ...UserInfoBasic
      ...UserInfoProjects
    }
  }
  ${MY_USER_INFO_FRAGMENT}
  ${MY_PROJECTS_FRAGMENT}
`;

const TEST_DEFERRED_QUERY = gql`
  query DeferredMeQuery {
    me {
      ...UserInfoBasic
      ...UserInfoProjects @defer
    }
  }
  ${MY_USER_INFO_FRAGMENT}
  ${MY_PROJECTS_FRAGMENT}
`;

function NonDeferred() {
  const { loading, error, data } = useQuery(TEST_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <p>First name: {data.me.firstName}</p>
      <p>Last name: {data.me.lastName}</p>
      <p>Email: {data.me.email}</p>
      {!data?.me?.projects
        ? "Loading projects..."
        : data.me.projects.map(({ id, name, numberOfStars }) => (
            <div key={id}>
              <p>Id: {id}</p>
              <p>Name: {name}</p>
              <p># of stars: {numberOfStars}</p>
            </div>
          ))}
    </div>
  );
}

function Deferred() {
  const { loading, error, data } = useQuery(TEST_DEFERRED_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      <p>First name: {data.me.firstName}</p>
      <p>Last name: {data.me.lastName}</p>
      <p>Email: {data.me.email}</p>
      {!data?.me?.projects
        ? "Loading projects..."
        : data.me.projects.map(({ id, name, numberOfStars }) => (
            <div key={id}>
              <p>Id: {id}</p>
              <p>Name: {name}</p>
              <p># of stars: {numberOfStars}</p>
            </div>
          ))}
    </>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <p>Testing @defer with Apollo Router.</p>
        </header>
        <div className="Grid-column">
          <div>
            <h2 className="Nondeferred-query">A non-deferred query ⏲️</h2>
            <NonDeferred />
          </div>
          <div>
            <h2 className="Deferred-query">A deferred query 🚀</h2>
            <Deferred />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
