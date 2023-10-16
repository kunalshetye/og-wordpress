export default function Post({ data }) {
  let thumbnail = data.Thumbnail;
  if (thumbnail === null || thumbnail === "") {
    thumbnail = "/default.jpeg";
  }
  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg shadow-lg"
      data-vercel-edit-target={""}
    >
      <div className="flex-shrink-0">
        <img className="object-cover w-full h-48" src={thumbnail} alt="" />
      </div>
      <div className="flex flex-col justify-between flex-1 p-6 bg-white">
        <div className="flex-1">
          <a href="#" className="block mt-2">
            <p className="line-clamp-2 text-xl font-semibold text-neutral-600">
              {data.Title}
            </p>
            <div
              className={`${getClassForSource(
                data.Source
              )} mt-2 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full text-gray-700 border`}
            >
              {data.Source}
            </div>
            <p
              className="line-clamp-6 mt-3 text-base text-gray-500"
              dangerouslySetInnerHTML={{ __html: data.Content }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function getClassForSource(source) {
  switch (source) {
    case "wordpress":
      return "bg-amber-400";
    default:
      return "bg-grey-400";
  }
}
