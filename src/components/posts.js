"use client";

import Post from "@/components/post";
import { GraphQLClient, gql } from "graphql-request";
import { useEffect, useState } from "react";

const graphqlEndpoint = `https://cg.optimizely.com/content/v2?auth=${process.env.NEXT_PUBLIC_OG_SINGLE_KEY}`;

const query = gql`
  query ExternalPosts {
    WordpressPosts(orderBy: { _ts: DESC }) {
      items {
        Id
        Title
        Content
        Thumbnail
        Source
      }
    }
  }
`;
export default function Posts() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const client = new GraphQLClient(graphqlEndpoint);
    client.request(query).then((response) => {
      console.log(response);
      setData(response.WordpressPosts.items);
    });
  }, []);
  return (
    <div className="relative px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <h1 className={"text-6xl mb-5 text-blue-500 font-mono"}>Posts</h1>
        <div className="grid max-w-lg gap-5 mx-auto lg:grid-cols-3 lg:max-w-none">
          {data && data.map((item) => <Post key={item.Id} data={item} />)}
        </div>
      </div>
    </div>
  );
}
