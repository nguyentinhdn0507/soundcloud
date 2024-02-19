import ButtonCommon from "@/components/Button/button.common";
import ProfileTracks from "@/components/ProfileTrack/profile.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";

const ProfileUserPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    page: number;
    pageSize: number;
  };
}) => {
  const slug = params.slug;
  const current = searchParams?.page ?? 1;
  const pageSize = 5;
  const data = await sendRequest<IBackendRes<IModelPaginate<ITrackTop[]>>>({
    url: `http://localhost:8000/api/v1/tracks/users`,
    method: "POST",
    body: { id: slug },
    queryParams: {
      current,
      pageSize,
      sort: "-createdAt",
    },
    nextOption: {
      next: { tag: ["track-by-profile"] },
    },
  });
  const result = data?.data?.result ?? [];
  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={5}>
        {result.map((item: any, index: number) => {
          return (
            <Grid item xs={12} md={6} key={index}>
              <ProfileTracks data={item} />
            </Grid>
          );
        })}
      </Grid>
      <ButtonCommon
        text="Load More"
        currentPage={current}
        slug={slug}
        pageSize={pageSize}
      />
    </Container>
  );
};

export default ProfileUserPage;
