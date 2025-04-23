
import { Layout } from "@/components/layout/Layout";
import { CommunityPosts } from "@/components/youtube/CommunityPosts";

const Community = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <CommunityPosts />
      </div>
    </Layout>
  );
};

export default Community;
