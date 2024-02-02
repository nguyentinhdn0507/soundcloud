import ProfileTracks from "@/components/ProfileTrack/profile.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";

const ProfileUserPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;

  const data = await sendRequest<IBackendRes<IModelPaginate<ITrackTop[]>>>({
    url: "http://localhost:8000/api/v1/tracks/users?current=2&pageSize=10",
    method: "POST",
    body: { id: slug },
    queryParams: {
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
    </Container>
  );
};

export default ProfileUserPage;
