import Head from "next/head";
import { Fragment } from "react";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}
// this function has to be the same name and also it is executed at pre-rendering
// cycle and it will executed during the build process and also it will not react
// to client in browser
// also it needs to return an object and also an props object in that..
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://Asutosh_1997:pEpF7pbVrpF5Lv9@cluster0.enyoi.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();

  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     // fetch data from an API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         },
//     };
// }

export default HomePage;
