import { normalize, schema } from "normalizr";
import { cloneAndMerge } from "../../../../utils/cloneAndMerge";
import normalizedFetchReducer from "../normalizedFetchReducer";

jest.mock("moment", () => () => ({
  valueOf: jest.fn().mockReturnValue(1986)
}));

const fetchId = "123";

const mockNested = {
  id: fetchId,
  author: {
    id: "1",
    name: "Paul"
  },
  title: "My awesome blog post",
  comments: [
    {
      id: "324",
      commenter: {
        id: "2",
        name: "Nicole"
      }
    }
  ]
};

const user = new schema.Entity("users");
const comment = new schema.Entity("comments", {
  commenter: user
});
const article = new schema.Entity("articles", {
  author: user,
  comments: [comment]
});

interface NormalizedSchema {
  articles: { id: string; title: string; comments: string[]; author: string };
  user: { id: string; name: string };
  comment: { id: string; commenter: string };
}

const fetchArguments = { article: fetchId };
type FetchArguments = typeof fetchArguments;

const { entities: expectedEntities } = normalize(mockNested, article);
const {
  actions: { addEntities, requestEntities, failureEntities, staleEntities },
  selectors: { getValue, getFetchMetadata, denormalizeRoot },
  reducer: articleFetchReducer
} = normalizedFetchReducer<
  FetchArguments,
  typeof mockNested,
  "articles",
  NormalizedSchema
>({
  baseSelector: state => state,
  keyFn: ({ article }: FetchArguments) => [article],
  schema: article,
  fetchFn: () => Promise.resolve(mockNested)
});

describe(normalizedFetchReducer, () => {
  it("returns state", () => {
    const state = {};
    expect(articleFetchReducer(state, { type: "bogus" } as any)).toBe(state);
  });

  it("handles adding new entities to empty state", () => {
    const state = {};
    expect(
      articleFetchReducer(state, addEntities(fetchArguments, mockNested))
    ).toEqual(
      cloneAndMerge(expectedEntities, {
        articles: {
          [fetchId]: {
            fetchMetadata: {
              isFetching: false,
              isStale: false,
              error: null,
              lastUpdated: 1986,
              fetchArguments
            }
          }
        }
      })
    );
  });

  it("handles adding new entities to existing state", () => {
    const state = expectedEntities;
    expect(
      articleFetchReducer(
        state,
        addEntities(
          { article: "345" },
          {
            id: "345",
            author: {
              id: "3",
              name: "JimmyDean"
            },
            title: "My other Sweet post",
            comments: [
              {
                id: "324",
                commenter: {
                  id: "2",
                  name: "Nicole"
                }
              }
            ]
          }
        )
      )
    ).toEqual(
      cloneAndMerge(expectedEntities, {
        articles: {
          "345": {
            fetchMetadata: {
              isFetching: false,
              isStale: false,
              error: null,
              lastUpdated: 1986,
              fetchArguments: { article: "345" }
            },
            author: "3",
            comments: ["324"],
            id: "345",
            title: "My other Sweet post"
          }
        },
        users: {
          "3": {
            id: "3",
            name: "JimmyDean"
          }
        }
      })
    );
  });

  it("updates existing entities", () => {
    const state = expectedEntities;
    expect(
      articleFetchReducer(
        state,
        addEntities(fetchArguments, {
          id: fetchId,
          title: "My new sweet post",
          comments: [
            {
              id: "324",
              commenter: {
                id: "2",
                name: "Nicole's alter ego"
              }
            }
          ]
        } as any)
      )
    ).toEqual(
      cloneAndMerge(expectedEntities, {
        articles: {
          [fetchId]: {
            title: "My new sweet post",
            fetchMetadata: {
              isFetching: false,
              isStale: false,
              error: null,
              lastUpdated: 1986,
              fetchArguments
            }
          }
        },
        users: {
          "2": {
            name: "Nicole's alter ego"
          }
        }
      })
    );
  });

  it("handles request fetch metadata for given root entity", () => {
    const state = {};
    expect(articleFetchReducer(state, requestEntities(fetchArguments))).toEqual(
      {
        articles: {
          [fetchId]: {
            fetchMetadata: {
              isFetching: true,
              isStale: false,
              fetchArguments
            }
          }
        }
      }
    );
  });

  it("overwrites defined fetchArguments with undefined values on request", () => {
    expect(
      articleFetchReducer(
        {
          articles: {
            [fetchId]: {
              fetchMetadata: {
                isFetching: true,
                isStale: false,
                fetchArguments: {
                  extraKey: true
                }
              }
            }
          }
        } as any,
        requestEntities(fetchArguments)
      )
    ).toEqual({
      articles: {
        [fetchId]: {
          fetchMetadata: {
            isFetching: true,
            isStale: false,
            fetchArguments
          }
        }
      }
    });
  });

  it("handles success fetch metadata for given root entity", () => {
    const state = articleFetchReducer({}, requestEntities(fetchArguments));
    expect(
      articleFetchReducer(state, addEntities(fetchArguments, mockNested))
    ).toEqual(
      cloneAndMerge(expectedEntities, {
        articles: {
          [fetchId]: {
            fetchMetadata: {
              isFetching: false,
              isStale: false,
              error: null,
              lastUpdated: 1986,
              fetchArguments
            }
          }
        }
      })
    );
  });

  it("handles failure fetch metadata for given root entity", () => {
    const error = { error: "chaosmonkey" };
    const state = articleFetchReducer({}, requestEntities(fetchArguments));
    expect(
      articleFetchReducer(state, failureEntities(fetchArguments, error))
    ).toEqual({
      articles: {
        [fetchId]: {
          fetchMetadata: {
            isFetching: false,
            isStale: false,
            lastUpdated: 1986,
            fetchArguments,
            error
          }
        }
      }
    });
  });

  it("overwrites error object", () => {
    const error = { error: "chaosmonkey" };
    const state = articleFetchReducer(
      {
        articles: {
          [fetchId]: {
            fetchMetadata: {
              isFetching: false,
              isStale: false,
              lastUpdated: 1986,
              fetchArguments,
              error: { extraErrorStuff: true }
            }
          }
        }
      } as any,
      requestEntities(fetchArguments)
    );
    expect(
      articleFetchReducer(state, failureEntities(fetchArguments, error))
    ).toEqual({
      articles: {
        [fetchId]: {
          fetchMetadata: {
            isFetching: false,
            isStale: false,
            lastUpdated: 1986,
            fetchArguments,
            error
          }
        }
      }
    });
  });

  it("handles set stale for root entity", () => {
    let state = articleFetchReducer({}, requestEntities(fetchArguments));
    state = articleFetchReducer(state, addEntities(fetchArguments, mockNested));
    state = articleFetchReducer(state, staleEntities(fetchArguments));
    expect(state).toEqual(
      cloneAndMerge(expectedEntities, {
        articles: {
          [fetchId]: {
            fetchMetadata: {
              isFetching: false,
              isStale: true,
              error: null,
              lastUpdated: 1986,
              fetchArguments
            }
          }
        }
      })
    );
  });

  it("selects root element value given fetch args", () => {
    let state = articleFetchReducer({}, requestEntities(fetchArguments));
    state = articleFetchReducer(state, addEntities(fetchArguments, mockNested));
    const normalizedValue = getValue(fetchArguments)(state);
    expect(normalizedValue).toEqual({
      author: "1",
      comments: ["324"],
      id: "123",
      title: "My awesome blog post"
    });
  });

  it("selects root element fetch metadata given fetch args", () => {
    let state = articleFetchReducer({}, requestEntities(fetchArguments));
    state = articleFetchReducer(state, addEntities(fetchArguments, mockNested));
    expect(getFetchMetadata(fetchArguments)(state)).toEqual({
      fetchArguments: {
        article: "123"
      },
      isFetching: false,
      isStale: false,
      error: null,
      lastUpdated: 1986
    });
  });

  it("denormalizes root element given fetch args", () => {
    let state = articleFetchReducer({}, requestEntities(fetchArguments));
    state = articleFetchReducer(state, addEntities(fetchArguments, mockNested));
    const root = denormalizeRoot(fetchArguments)(state);
    expect(root).toEqual({
      ...mockNested,
      fetchMetadata: {
        isFetching: false,
        isStale: false,
        error: null,
        lastUpdated: 1986,
        fetchArguments
      }
    });
  });
});
