
import { Layout } from "@/components/layout/Layout";
import { CommentManagement } from "@/components/youtube/CommentManagement";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const Comments = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Comment Management</h1>
                  <p className="opacity-90">Engage with your audience by responding to comments</p>
                </div>
                <MessageSquare size={48} className="opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <CommentManagement />
      </div>
    </Layout>
  );
};

export default Comments;
