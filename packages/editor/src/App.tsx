import { Editor, type PersistenceEditorProps } from './editor/Editor';

function App(props: PersistenceEditorProps) {
  return <Editor {...props} />;
}

export default App;
