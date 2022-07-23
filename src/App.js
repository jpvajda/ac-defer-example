import logo from "./logo.png";
import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

// a test query

const TEST_QUERY = gql`
  query Query {
    allProducts {
      id
      delivery {
        estimatedDelivery
        fastestDelivery
      }
    }
  }
`;

// a deferred query
const DEFERRED_QUERY = gql`
  query Dimensions {
    allProducts {
      delivery {
        ...MyFragment @defer
      }
      sku
      id
    }
  }

  fragment MyFragment on DeliveryEstimates {
    estimatedDelivery
    fastestDelivery
  }
`;

// a non-deferred query
const NON_DEFERRED_QUERY = gql`
  query Dimensions {
    allProducts {
      delivery {
        ...MyFragment
      }
      sku
      id
    }
  }

  fragment MyFragment on DeliveryEstimates {
    estimatedDelivery
    fastestDelivery
  }
`;

function TestQuery() {
  const { loading, error, data } = useQuery(TEST_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.allProducts.map(({ id, estimatedDelivery, fastestDelivery }) => (
    <div key={id}>
      <p>{id}</p>
      <p>{estimatedDelivery}</p>
      <p>{fastestDelivery}</p>
    </div>
  ));
}

function DeferredProducts() {
  const { loading, error, data } = useQuery(DEFERRED_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.allProducts.map(({ id, estimatedDelivery, fastestDelivery }) => (
    <div key={id}>
      <p>{id}</p>
      <p>{estimatedDelivery}</p>
      <p>{fastestDelivery}</p>
    </div>
  ));
}

function NonDeferredProducts() {
  const { loading, error, data } = useQuery(NON_DEFERRED_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.allProducts.map(({ id, estimatedDelivery, fastestDelivery }) => (
    <div key={id}>
      <p>{id}</p>
      <p>{estimatedDelivery}</p>
      <p>{fastestDelivery}</p>
    </div>
  ));
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Testing @defer with Apollo Router.</p>
        </header>
        <div className="Grid-column">
          <div>
            <h2 className="Test-query">A test query 🧪 </h2>
            <TestQuery />
          </div>
          <div>
            <h2 className="Deferred-query">A deferred query 🚀</h2>
            <DeferredProducts />
          </div>
          <div>
            <h2 className="Nondeferred-query">A non-deferred query ⏲️</h2>
            <NonDeferredProducts />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
