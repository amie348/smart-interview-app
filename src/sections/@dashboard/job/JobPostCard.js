import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent, Stack } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

JobPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function JobPostCard({ post, index, onSelect, setSelectedJob }) {
  const { _id, postPicture, title, expiryDate, jobDescription, salary, postedBy, createdAt } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  // const POST_INFO = [
  //   { number: comment, icon: 'eva:message-circle-fill' },
  //   { number: view, icon: 'eva:eye-fill' },
  //   { number: share, icon: 'eva:share-fill' },
  // ];

  const onSelecting = () => {
    onSelect(post)
  }

  return (
    <Grid item xs={12} sm={6} md={ 3}>
      <Card sx={{ position: 'relative', 
                  cursor: "pointer", 
                  border: "solid 1px rgb(99, 115, 129, 0.2)",
                  boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.2), 0 3px 10px 0px rgba(0, 0, 0, 0.19);" }}
                  
              onClick={onSelecting}>
        <CardMediaStyle
        >
          <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              // ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />
          <AvatarStyle
            alt={postedBy.company.companyName}
            src={postedBy.company.dp ? postedBy.company.dp : "/static/mock-images/avatars/avatar_0.jpg"}
            // sx={{
            //   ...((latestPostLarge || latestPost) && {
            //     zIndex: 9,
            //     top: 24,
            //     left: 24,
            //     width: 40,
            //     height: 40,
            //   }),
            // }}
          />

          <CoverImgStyle alt={title} src={postPicture} />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4,
            // ...((latestPostLarge || latestPost) && {
            //   bottom: 0,
            //   width: '100%',
            //   position: 'absolute',
            // }),
          }}
        >

          <TitleStyle
            // to="#"
            color="inherit"
            variant="subtitle2"
            underline="hover"
            // component={RouterLink}
            // sx={{
            //   ...(latestPostLarge && { typography: 'h5', height: 60 }),
            //   ...((latestPostLarge || latestPost) && {
            //     color: 'common.white',
            //   }),
            // }}
          >
            {title}
          </TitleStyle>

          <Stack direction={{xs: "column", sm:"row"}} sx={{display:"flex", justifyContent:"space-between"}}>
            <Stack>
              <Typography  variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Salary ($)
              </Typography>
              <Typography  variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                {salary.start}-{salary.end}
              </Typography>
            </Stack>
            <Stack>
              <Typography  variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Deadline : {moment(expiryDate).fromNow()}
              </Typography>
              <Typography  variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Posted By : {postedBy.company.companyName}
              </Typography>
            </Stack>
          </Stack>

          {/* <InfoStyle>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5,
                  // ...((latestPostLarge || latestPost) && {
                  //   color: 'grey.500',
                  // }),
                }}
              >
                 <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} /> 
                <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
              </Box>
            ))}
          </InfoStyle> */}

        </CardContent>
      </Card>
    </Grid>
  );
}
