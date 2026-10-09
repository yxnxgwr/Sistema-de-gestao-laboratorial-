import { FormEvent, useEffect, useState } from "react";

type Patient = {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  createdAt: string;
};

const API = "http://localhost:3333";

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("Carregando pacientes...");
  const [loading, setLoading] = useState(false);

  async function loadPatients() {
    try {
      const response = await fetch(`${API}/api/patients`);
      if (!response.ok) throw new Error("Não foi possível carregar os pacientes.");
      const data: Patient[] = await response.json();
      setPatients(data);
      setMessage(data.length ? "" : "Nenhum paciente cadastrado ainda.");
    } catch {
      setMessage("Não foi possível conectar à API. Confira se o backend está em execução.");
    }
  }

  useEffect(() => { void loadPatients(); }, []);

  async function submitPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, birthDate })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Erro ao cadastrar paciente.");
      setName("");
      setEmail("");
      setBirthDate("");
      setMessage("Paciente cadastrado com sucesso.");
      await loadPatients();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function deletePatient(id: string) {
    if (!window.confirm("Deseja excluir este paciente de teste?")) return;
    try {
      const response = await fetch(`${API}/api/patients/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Não foi possível excluir o paciente.");
      setMessage("Paciente removido.");
      await loadPatients();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado.");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">L</div>
        <div><strong>LabFlow</strong><span>GESTÃO LABORATORIAL</span></div>
        <div className="status"><i /> API REST</div>
      </header>

      <section className="hero">
        <p className="eyebrow">PAINEL DE CONTROLE</p>
        <h1>Gestão simples.<br /><em>Atendimento organizado.</em></h1>
        <p className="intro">Um espaço para gerenciar cadastros de pacientes de demonstração.</p>
      </section>

      <section className="stats">
        <article className="stat-card"><span>Pacientes cadastrados</span><strong>{patients.length.toString().padStart(2, "0")}</strong><small>Registros no sistema</small></article>
        <article className="stat-card"><span>Serviço</span><strong className="online">Online</strong><small>Conexão via API REST</small></article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading"><div><p className="eyebrow">NOVO REGISTRO</p><h2>Cadastrar paciente</h2></div><span className="plus">＋</span></div>
          <form onSubmit={submitPatient}>
            <label>Nome completo<input value={name} onChange={e => setName(e.target.value)} minLength={2} required placeholder="Ex.: Ana Silva" /></label>
            <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ana@exemplo.com" /></label>
            <label>Data de nascimento<input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required /></label>
            <button disabled={loading}>{loading ? "Salvando..." : "Cadastrar paciente"} <span>→</span></button>
          </form>
          {message && <p className="message" role="status">{message}</p>}
        </article>

        <article className="panel list-panel">
          <div className="panel-heading"><div><p className="eyebrow">BASE DE DADOS</p><h2>Pacientes recentes</h2></div><button className="refresh" onClick={() => void loadPatients()} aria-label="Atualizar lista">↻</button></div>
          {patients.length === 0 ? <div className="empty"><div>◎</div><strong>Sua lista está vazia</strong><p>Cadastre um paciente de teste para começar.</p></div> :
            <div className="patient-list">{patients.map(patient => <div className="patient" key={patient.id}><div className="avatar">{patient.name.trim().charAt(0).toUpperCase()}</div><div className="patient-info"><strong>{patient.name}</strong><span>{patient.email}</span></div><button className="delete" onClick={() => void deletePatient(patient.id)} aria-label={`Excluir ${patient.name}`}>×</button></div>)}</div>}
        </article>
      </section>
      <footer>LABFLOW <span>•</span> PROJETO EDUCACIONAL FULL STACK <span>•</span> DADOS FICTÍCIOS</footer>
    </main>
  );
}
