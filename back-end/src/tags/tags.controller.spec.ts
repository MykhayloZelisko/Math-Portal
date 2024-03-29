import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { Tag } from './models/tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

describe('TagsController', () => {
  let controller: TagsController;
  const mockTagsService = {
    createTag: jest.fn(),
    getAllTags: jest.fn(),
    removeTag: jest.fn(),
    updateTag: jest.fn(),
  };
  const mockAdminGuard = {
    canActivate: jest.fn(),
  };
  const mockTag: Tag = {
    id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
    value: 'Tag',
  } as Tag;
  const mockTag2: Tag = {
    id: '4481c65d-55de-4054-b18e-b14d0fae37ca',
    value: 'Tag 2',
  } as Tag;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockAdminGuard)
      .compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTag', () => {
    it('should create tag', async () => {
      mockTagsService.createTag.mockResolvedValue(mockTag);
      const tagData: CreateTagDto = { value: 'Tag' };
      const result = await controller.createTag(tagData);

      expect(result).toEqual(mockTag);
      expect(mockTagsService.createTag).toHaveBeenCalledWith(tagData);
    });
  });

  describe('getAllTags', () => {
    it('should get all tags', async () => {
      const expectedResult: Tag[] = [mockTag, mockTag2];
      mockTagsService.getAllTags.mockResolvedValue(expectedResult);
      const result = await controller.getAllTags();

      expect(result).toEqual(expectedResult);
      expect(mockTagsService.getAllTags).toHaveBeenCalled();
    });
  });

  describe('removeTag', () => {
    it('should remove tag', async () => {
      const tagId = '6869d59c-1858-46a2-b8ff-273f29e4566e';
      mockTagsService.removeTag.mockResolvedValue(void 0);
      const result = await controller.removeTag(tagId);

      expect(result).toBeUndefined();
      expect(mockTagsService.removeTag).toHaveBeenCalledWith(tagId);
    });
  });

  describe('updateTag', () => {
    it('should update tag', async () => {
      const tagData: UpdateTagDto = { value: 'Tag' };
      const tagId = '6869d59c-1858-46a2-b8ff-273f29e4566e';
      mockTagsService.updateTag.mockResolvedValue(mockTag);
      const result = await controller.updateTag(tagId, tagData);

      expect(result).toEqual(mockTag);
      expect(mockTagsService.updateTag).toHaveBeenCalledWith(tagId, tagData);
    });
  });
});
