import { CommentWithDescendantsInterface } from '../models/interfaces/comment-with-descendants.interface';
import { CommentsTreeInterface } from '../models/interfaces/comments-tree.interface';
import { DescendantInterface } from '../models/interfaces/descendant.interface';
import { environment } from '../../../environments/environment';

export function commentsListMapper(
  list: CommentWithDescendantsInterface[],
): CommentsTreeInterface[] {
  let commentsTree: CommentsTreeInterface[] = list.map(
    (listItem: CommentWithDescendantsInterface) => {
      const foundItem: DescendantInterface | undefined =
        listItem.descendantsList.find(
          (item: DescendantInterface) => item.descendantId === listItem.id,
        );
      return {
        id: listItem.id,
        content: listItem.content,
        createdAt: listItem.createdAt,
        updatedAt: listItem.updatedAt,
        likesUsersIds: listItem.likesUsersIds,
        dislikesUsersIds: listItem.dislikesUsersIds,
        user: {
          ...listItem.user,
          photo: listItem.user.photo
            ? `${environment.apiUrl}/${listItem.user.photo}`
            : null,
        },
        nearestAncestorId: foundItem ? foundItem.nearestAncestorId : null,
        level: foundItem ? foundItem.level : -1,
        children: [],
      };
    },
  );
  const maxLevel: number = Math.max(
    ...commentsTree.map((item: CommentsTreeInterface) => item.level),
  );
  for (let k = maxLevel; k > 1; k--) {
    const commentsList: CommentsTreeInterface[] = commentsTree.filter(
      (item: CommentsTreeInterface) => item.level === k,
    );
    commentsTree = commentsTree.filter(
      (item: CommentsTreeInterface) => item.level !== k,
    );
    for (const item of commentsTree) {
      for (const childrenItem of commentsList) {
        if (childrenItem.nearestAncestorId === item.id) {
          item.children.push(childrenItem);
        }
      }
    }
  }
  return commentsTree;
}
