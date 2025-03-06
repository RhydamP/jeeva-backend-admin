import { Container, Table } from "@medusajs/ui";
import { BlogGet } from "../routes/api/blogs";
import { useState } from "react";
import CreateBlog from "../util/createBlog";
import UpdateBlog from "../util/updateBlog";
import DeleteBlog from "../util/deleteBlog";
import { WidgetConfig, defineWidgetConfig } from "@medusajs/admin-sdk";


const BlogContent = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const limit = 20;
    const offset = currentPage * limit;
    const { data, isLoading, refetch } = BlogGet({ limit, offset });
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);



    return (
        <Container>
            <CreateBlog refetch={refetch}/>
            {selectedBlogId && <UpdateBlog id={selectedBlogId} onClose={() => setSelectedBlogId(null)} />}
            {isLoading ? (
                <p>Loading...</p>
            ) : data?.blogs ? (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Author</Table.HeaderCell>
                            <Table.HeaderCell>SEO Title</Table.HeaderCell>
                            <Table.HeaderCell>Update Blog</Table.HeaderCell>
                            <Table.HeaderCell>Delete Blog</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.blogs.map((blog) => (
                            <Table.Row key={blog.id} >
                                <Table.Cell>{blog.title}</Table.Cell>
                                <Table.Cell>{blog.author}</Table.Cell>
                                <Table.Cell>{blog.seo_title}</Table.Cell>
                                <Table.Cell className=" cursor-pointer"
                                > {blog.id && <UpdateBlog id={blog.id} onClose={() => setSelectedBlogId(null)} />}</Table.Cell>
                                <Table.Cell className=" cursor-pointer"
                                > {blog.id && <DeleteBlog id={blog.id} onClose={() => setSelectedBlogId(null)} refetch={refetch} />}</Table.Cell>
                            </Table.Row>

                        ))}
                    </Table.Body>
                </Table>
            ) : (
                <p>No blogs found.</p>
            )}
        </Container>
    );
};

export const config: WidgetConfig = defineWidgetConfig({
    zone: ["product.list.after"],
  });


export default BlogContent;
