import {
  BaseRpcClient,
  createMessageConnection,
  Emitter,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  Event,
  PersistenceActionArgs,
  PersistenceClient,
  PersistenceContext,
  PersistenceEditorData,
  PersistenceNotificationTypes,
  PersistenceOnNotificationTypes,
  PersistenceRequestTypes,
  PersistenceSaveDataArgs
} from '@axonivy/persistence-editor-protocol';

export class PersistenceClientJsonRpc extends BaseRpcClient implements PersistenceClient {
  protected onDataChangedEmitter = new Emitter<void>();
  protected onValidationChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  onValidationChanged: Event<void> = this.onValidationChangedEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.toDispose.push(this.onValidationChangedEmitter);
    this.onNotification('dataChanged', data => {
      this.onDataChangedEmitter.fire(data);
    });
  }

  initialize(context: PersistenceContext): Promise<void> {
    return this.sendRequest('initialize', { ...context });
  }

  data(context: PersistenceContext): Promise<PersistenceEditorData> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: PersistenceSaveDataArgs): Promise<EditorFileContent> {
    return this.sendRequest('saveData', { ...saveData });
  }

  action(action: PersistenceActionArgs): void {
    void this.sendNotification('action', action);
  }

  sendRequest<K extends keyof PersistenceRequestTypes>(command: K, args?: PersistenceRequestTypes[K][0]): Promise<PersistenceRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof PersistenceNotificationTypes>(command: K, args: PersistenceNotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  onNotification<K extends keyof PersistenceOnNotificationTypes>(kind: K, listener: (args: PersistenceOnNotificationTypes[K]) => unknown): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-persistence-lsp');
  }

  public static async startClient(connection: Connection): Promise<PersistenceClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<PersistenceClientJsonRpc> {
    const client = new PersistenceClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
