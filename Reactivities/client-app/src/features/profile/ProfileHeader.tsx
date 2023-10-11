import {
  Button,
  Divider,
  Grid,
  Header,
  Item,
  Reveal,
  Segment,
  Statistic,
} from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import FollowButton from "./FollowButton";

interface Props {
  profile: Profile;
}

//*  Profile object is coming from a store. We may not be accessing the store directly but this function needs to be an observer to
//* use profile object.
export default observer(function ProfileHeader({ profile }: Props) {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile.image || "/assets/user.png"}
              />
              <Item.Content verticalAlign="middle">
                <Header as="h1" content={profile.displayName} />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label="followers" value={profile.followersCount} />
            <Statistic label="following" value={profile.followingCount} />
          </Statistic.Group>
          <Divider />
          <FollowButton profile={profile} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
});
