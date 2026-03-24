import api from './axiosInstance';

export interface PostList {
    id: number;
    name: string;
    user_id: number;
    color_list?: string;
    created_at: string;
    updated_at: string;
    user_count?: number;
}

export interface PostListUser {
    id: number;
    post_list_id: number;
    follower_user_id: number;
    created_at: string;
    updated_at: string;
    follow_user_name: string;
    follow_user_x_account: string;
    post_list_name: string | null;
}

export const getPostLists = async (withCount = false) => {
    const response = await api.get<PostList[]>('/post-lists/', {
        params: { with_count: withCount }
    });
    return response.data;
};

export const createPostList = async (name: string, colorList?: string) => {
    const response = await api.post<PostList>('/post-lists/', { name, color_list: colorList });
    return response.data;
};

export const updatePostList = async (id: number, data: Partial<Pick<PostList, 'name' | 'color_list'>>) => {
    const response = await api.put<PostList>(`/post-lists/${id}`, data);
    return response.data;
};

export const deletePostList = async (id: number) => {
    await api.delete(`/post-lists/${id}`);
};

export const getPostListUsers = async (postListId: number) => {
    const response = await api.get<PostListUser[]>(`/post-list-users/post-list/${postListId}`);
    return response.data;
};

export const deletePostListUser = async (postListUserId: number) => {
    await api.delete(`/post-list-users/${postListUserId}`);
};

export const deletePostListUserRelation = async (postListId: number, followerUserId: number) => {
    await api.delete(`/post-list-users/relation/${postListId}/${followerUserId}`);
};
export const createPostListUser = async (postListId: number, followerUserId: number) => {
    const response = await api.post<PostListUser>('/post-list-users/', {
        post_list_id: postListId,
        follower_user_id: followerUserId
    });
    return response.data;
};
