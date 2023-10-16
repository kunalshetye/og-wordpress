import { getConfig } from "@/components/syncHelper";

const { syncEndpoint, authorizationKey } = getConfig();
const webhookSecret = process.env.WP_WEBHOOK_SECRET;

export async function GET(request) {
  return Response.json({ message: "hello, is that you wordpress?" });
}

export async function POST(request) {
  const searchParams = request.nextUrl.searchParams;
  const querySecret = searchParams.get("secret");
  if (webhookSecret !== querySecret) {
    return Response.json(`Invalid credentials`, {
      status: 401,
    });
  }
  const item = await request.json();
  console.log(item);
  await syncPost(item, "en");
  return Response.json({ message: "OK" });
}

async function syncPost(item, language) {
  const status = item.post.post_status;
  if (status !== "publish" && status !== "trash") {
    return;
  } else if (status === "publish") {
    item.post.post_status = "Published";
  } else if (status === "trash") {
    item.post.post_status = "Deleted";
  }
  console.log(item.post.post_title + `[${item.post.post_status}]`);
  const indexEntry = generateIndexEntry(item, language);
  const contentEntry = generatePostContentEntry(item);
  const syncEntry = `${indexEntry}\n${contentEntry}`;
  console.log("syncEntry: \n" + syncEntry);

  const response = await fetch(syncEndpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/x-ndjson",
      Authorization: `Basic ${authorizationKey}`,
    },
    body: syncEntry,
  });
  console.log(`response: ${response.status} - ${response.statusText}`);
}

function generateIndexEntry(item, language) {
  return JSON.stringify({
    index: { _id: `wp-${item.post_id}`, language_routing: language },
  });
}

function generatePostContentEntry(item) {
  let thumbnail = item.post_thumbnail ?? "";
  if (thumbnail !== "") {
    thumbnail = new URL(item.post.guid).origin + thumbnail;
  }
  return JSON.stringify({
    Id: `wp-${item.post_id}`,
    _ts: `${new Date().toJSON()}`,
    Title___searchable: item.post.post_title,
    Content___searchable: item.post.post_content,
    Thumbnail: thumbnail,
    Source: "wordpress",
    ContentType: ["WordpressPosts"],
    Status: item.post.post_status,
    RolesWithReadAccess: "Everyone",
  });
}
