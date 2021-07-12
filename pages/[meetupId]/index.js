import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

function MeetupDetails(props) {
    console.log(props);
  return (
      <Fragment>
          <Head>
              <title>{props.title}</title>
              <meta name="props.description" content={props.description} />
          </Head>
    <MeetupDetail
      image={props.image}
      title={props.title}
      address={props.address}
      description={props.description}
    />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://Asutosh_1997:pEpF7pbVrpF5Lv9@cluster0.enyoi.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: false,
    paths: meetups.map(meetup => ({
      params: { meetupId: meetup._id.toString() }
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://Asutosh_1997:pEpF7pbVrpF5Lv9@cluster0.enyoi.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});
  client.close();
  // fetch data for a single meetup
  return {
    props: {
      id: selectedMeetup._id.toString(),
      title: selectedMeetup.title,
      address: selectedMeetup.address,
      image: selectedMeetup.image,
      description: selectedMeetup.description
    },
  };
}

export default MeetupDetails;
