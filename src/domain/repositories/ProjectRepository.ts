import { IProject, Project } from '../models/project';
import { GenericRepository } from './GenericRepository';
import mongoose from 'mongoose';

export class ProjectRepository extends GenericRepository<IProject> {
  
  constructor() {
    super(Project);
  }

  async findProjectsByUser(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IProject[]> {
    const userIdString =
      userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;

    return this.model.find({
      $or: [{ owner: userIdString }, { members: userIdString }],
    });
  }

  async addMember(
    projectId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): Promise<IProject | null> {
    const projectIdString =
      projectId instanceof mongoose.Types.ObjectId
        ? projectId.toString()
        : projectId;

    const userIdString =
      userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;

    return this.model.findByIdAndUpdate(
      projectIdString,
      { $addToSet: { members: userIdString } },
      { new: true }
    );
  }

  async removeMember(
    projectId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): Promise<IProject | null> {
    const projectIdString =
      projectId instanceof mongoose.Types.ObjectId
        ? projectId.toString()
        : projectId;

    const userIdString =
      userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;

    return this.model.findByIdAndUpdate(
      projectIdString,
      { $pull: { members: userIdString } },
      { new: true }
    );
  }

  async deleteWithSession(
    projectId: string,
    session: any
  ): Promise<IProject | null> {
    return this.model.findByIdAndDelete(projectId, { session });
  }
}
