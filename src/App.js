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

const MY_FRAGMENT = gql`
  fragment MyFragment on DeliveryEstimates {
    estimatedDelivery
    fastestDelivery
  }
`;

// a deferred query
const DEFERRED_QUERY = gql`
  query deferVariation {
    allProducts {
      delivery {
        ...MyFragment @defer
      }
      sku,
      id
    }
  }
  ${MY_FRAGMENT}
`;

// a non-deferred query
const NON_DEFERRED_QUERY = gql`
  query deferVariation {
    allProducts {
      delivery {
        ...MyFragment
      }
      sku,
      id
    }
  }
  ${MY_FRAGMENT}
`;

function DeferredProducts() {
  return Render(DEFERRED_QUERY)
}

function NonDeferredProducts() {
  return Render(NON_DEFERRED_QUERY)
}

function Render(query) {
  const { loading, error, data } = useQuery(query);

  if (loading) return <p>Loading...</p>;
  if (error) {
	console.error(error);
	return <p>Error :(</p>;
  }

  return (
    <div>
    {data.allProducts.map(({ id, sku, delivery }) =>
      <div key={id}>
        <b>{id} - {sku}</b>
        <p>Delivery:{' '}
          <span>{delivery.fastestDelivery}</span>{' - '}
          <span>{delivery.estimatedDelivery}</span>
        </p>

      </div>
    )}
    </div>
  )
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
            <NonDeferredProducts />
          </div>
          <div>
            <h2 className="Deferred-query">A deferred query 🚀</h2>
            <DeferredProducts />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
