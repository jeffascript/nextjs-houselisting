import Layout from "src/components/layout";
import FirebaseAuth from "src/components/firebaseAuth";
import { GetServerSideProps, NextApiRequest } from "next";
import { loadIdToken } from "src/auth/firebaseAdmin";

export default function Auth() {
  return <Layout main={<FirebaseAuth />} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);
  // console.log({ uid });// to see the uid printed on the console

  /**
   * If there is a UID, move user to Home, he doesn't need the auth page shown
   */
  if (uid) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
  }

  return {
    props: {},
  };
};
