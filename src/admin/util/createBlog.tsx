import { FocusModal, Heading, Input, ProgressTabs, toast, Textarea } from "@medusajs/ui";
import { useCreateBlog } from "../routes/api/blogs";
import { useState } from "react";
import { PlusMini } from "@medusajs/icons";
import { Button } from "@medusajs/ui";


const CreateBlog = ({ refetch }: any) => {
    const [formData, setFormData] = useState<{
        author: string;
        tags: string[];
        url_slug: string;
        title: string;
        subtitle: string;
        description: { content: string };
        draft: string;
        files: File[];
        seo_title: string;
        seo_keywords: string;
        seo_description: string;
        published_date: string | null;
        updated_date: string | null;
        social_media_meta: Record<string, any>;
        canonical_url: string;
        alt_tags: Record<string, any>;
        internal_links: Record<string, any>;
        external_links: Record<string, any>;
    }>({
        author: "",
        tags: [],
        url_slug: "",
        title: "",
        subtitle: "",
        description: { content: "" },
        draft: "false",
        files: [],
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        published_date: null,
        updated_date: null,
        social_media_meta: {},
        canonical_url: "",
        alt_tags: {},
        internal_links: {},
        external_links: {},
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const createBlogMutation = useCreateBlog();

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            if (name === "tags") {
                const tagsArray = value ? value.split(",").map((tag: string) => tag.trim()) : [];
                return { ...prevFormData, tags: tagsArray };
            }

            else if (name === "description") {
                return { ...prevFormData, description: { content: value } };
            }

            else if (name === "published_date" || name === "updated_date") {
                if (value.trim() !== "") {
                    try {
                        return { ...prevFormData, [name]: new Date(value).toISOString() };
                    } catch (error) {
                        return { ...prevFormData, [name]: null };
                    }
                } else {
                    return { ...prevFormData, [name]: undefined };
                }
            }

            else {
                return { ...prevFormData, [name]: value };
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                files: [...prev.files, ...Array.from(files) as File[]],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "files" && Array.isArray(value)) {
                value.forEach((file) => formDataToSend.append("files", file));
            } else if (typeof value === "object" && value !== null) {
                formDataToSend.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString());
            }
        });

        try {
            await createBlogMutation.mutateAsync(formDataToSend);
            toast.success("Blog created successfully!");
            setIsModalOpen(false);
            refetch();
        } catch (error: any) {
            const errorMsg = error.message || "An unexpected error occurred.";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between mb-5">
                <Heading>Blog here</Heading>
                <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <FocusModal.Trigger asChild>
                        <Button variant="secondary" className="w-30 h-10"  onClick={() => setIsModalOpen(true)}>
                            Add Blog <PlusMini />
                        </Button>
                    </FocusModal.Trigger>
                    <FocusModal.Content>
                        <FocusModal.Header>
                            <FocusModal.Title>Add a New Blog</FocusModal.Title>
                            <Button onClick={handleSubmit} disabled={isLoading} className="relative flex items-center justify-center">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </FocusModal.Header>
                        <FocusModal.Body>
                        <ProgressTabs defaultValue="general">
                            <ProgressTabs.List>
                                <ProgressTabs.Trigger value="general">General</ProgressTabs.Trigger>
                                <ProgressTabs.Trigger value="Images_Upload">Images</ProgressTabs.Trigger>
                                <ProgressTabs.Trigger value="Seo_others">SEO & Others</ProgressTabs.Trigger>
                            </ProgressTabs.List>

                            <ProgressTabs.Content value="general">
                                <div className=" w-full flex flex-row items-center gap-6 justify-between px-14 py-16 space-y-4 max-w-8xl">
                                    <div className="flex flex-col gap-3">
                                        <label className="block text-xl font-medium">Author</label>
                                        <Input type="text" name="author" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="Author Name" />

                                        <label className="block text-xl font-medium">Tags</label>
                                        <Input type="text" name="tags" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="Comma separated tags" required={true} />

                                        <label className="block text-xl font-medium">Title</label>
                                        <Input type="text" name="title" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="Blog Title" />

                                        <label className="block text-xl font-medium">Subtitle</label>
                                        <Input type="text" name="subtitle" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="Subtitle" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="block text-xl font-medium">URL Slug</label>
                                        <Input type="text" name="url_slug" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="URL Slug" />

                                        <label className="block text-xl font-medium">Description</label>
                                        <Textarea name="description" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="Blog description..." />


                                    </div>
                                </div>
                            </ProgressTabs.Content>

                            <ProgressTabs.Content value="Images_Upload">
                                <div className="flex flex-col gap-6 py-12 px-12 m-w-8xl">
                                    <label className=" text-xl font-medium">Thumbnail Images</label>
                                    <Input type="file" className="w-[60vw] h-[6vh]" multiple onChange={(e) => handleFileUpload(e)} />

                                </div>
                            </ProgressTabs.Content>

                            <ProgressTabs.Content value="Seo_others">
                                <div className=" w-full flex flex-row items-center gap-6 justify-between px-14 py-16 space-y-4 max-w-8xl">
                                    <div className="flex flex-col gap-3">

                                        <label className="block text-xl font-medium">SEO Title</label>
                                        <Input type="text" name="seo_title" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="SEO Title" />

                                        <label className="block text-xl font-medium">SEO Keywords</label>
                                        <Input type="text" name="seo_keywords" onChange={handleChange} placeholder="SEO Keywords" />

                                        <label className="block text-xl font-medium">SEO Description</label>
                                        <Textarea name="seo_description" onChange={handleChange} placeholder="SEO Description" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="block text-xl font-medium">Canonical URL</label>
                                        <Input type="text" name="canonical_url" className="w-[40vw] h-[5vh]" onChange={handleChange} placeholder="Canonical URL" />

                                        <label className="block text-xl font-medium">Published Date</label>
                                        <Input type="date" name="published_date" onChange={handleChange} />

                                        <label className="block text-xl font-medium">Update Date</label>
                                        <Input type="date" name="updated_date" onChange={handleChange} />
                                    </div>
                                </div>
                            </ProgressTabs.Content>
                        </ProgressTabs>
                    </FocusModal.Body>
                    </FocusModal.Content>
                </FocusModal>
            </div>
        </div>
    );
};

export default CreateBlog;
