import { Minus } from "@medusajs/icons"
import { Button, toast } from "@medusajs/ui";
import { Prompt } from "@medusajs/ui";
import { useDeleteBlog } from "../routes/api/blogs";


const DeleteBlog = ({ id, onClose, refetch }: { id: string, onClose: () => void, refetch: () => void }) => {

    const deleteBlogMutation = useDeleteBlog();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        deleteBlogMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Blog deleted successfully!");
                onClose(); 
                refetch(); 
            },
            onError: (error : any) => {
                const errorMessage = error.response?.data?.error || "An error occurred while deleting.";
                toast.error(errorMessage);
            }
        });
    };
    


    return (
        <div className="flex justify-between">

            <Prompt>
                <Prompt.Trigger asChild>
                    <Button><Minus />Delete</Button>
                </Prompt.Trigger>
                <Prompt.Content>
                    <Prompt.Header>
                        <Prompt.Title>Delete something</Prompt.Title>
                        <Prompt.Description>
                            Are you sure? This cannot be undone.
                        </Prompt.Description>
                    </Prompt.Header>
                    <Prompt.Footer>
                        <Prompt.Cancel>Cancel</Prompt.Cancel>
                        <Prompt.Action onClick={handleSubmit}>Delete</Prompt.Action>
                    </Prompt.Footer>
                </Prompt.Content>
            </Prompt>

        </div>
    )
}

export default DeleteBlog;