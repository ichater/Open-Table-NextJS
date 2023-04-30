import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className="font-bold underline text-7xl">Hola mi amigos</h1>
      <div className="test"> testText</div>
    </main>
  );
}
