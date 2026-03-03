import BaseRepository from "./BaseRepository";

// @Component()
class ProxyRepository extends BaseRepository<FrpcProxy> {
  constructor() {
    super("proxy");
  }

  updateProxyStatus(id: string, status: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $set: { status: status } },
        {},
        (err, numberOfUpdated, upsert) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  updateProxyStatusByIds(ids: string[], status: number): Promise<void> {
    if (!ids || ids.length === 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      this.db.update(
        { _id: { $in: ids } },
        { $set: { status: status } },
        { multi: true },
        err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  deleteByIds(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      this.db.remove(
        { _id: { $in: ids } },
        { multi: true },
        err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

export default ProxyRepository;
