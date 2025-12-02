# 🏥 SGHSS - Sistema de Gestão Hospitalar VidaPlus

![Badge](https://img.shields.io/static/v1?label=Status&message=Concluido&color=green&style=for-the-badge)
![Badge](https://img.shields.io/static/v1?label=Tecnologia&message=HTML5%20CSS3%20JS&color=blue&style=for-the-badge)
![Badge](https://img.shields.io/static/v1?label=Frontend&message=Bootstrap%205&color=purple&style=for-the-badge)

> Projeto desenvolvido para a disciplina de **Projeto Multidisciplinar** (UNINTER), baseado no Estudo de Caso da instituição **VidaPlus**.

---

## 📋 Sobre o Projeto

O **SGHSS (Sistema de Gestão Hospitalar e de Serviços de Saúde)** é uma aplicação web desenvolvida com foco em Front-end para centralizar processos hospitalares. [cite_start]O sistema atende aos requisitos do estudo de caso VidaPlus, oferecendo interfaces para **Pacientes**, **Profissionais de Saúde** e **Administradores**.

O projeto foi construído utilizando conceitos de **Mobile First**, **Design Responsivo** e **Glassmorphism**, simulando um ambiente de produção real com persistência de dados local.

---

## 🚀 Funcionalidades Principais

O sistema atende aos Requisitos Funcionais (RF) e Não Funcionais (RNF) propostos:

### 👤 Módulo do Paciente 
- **Dashboard:** Visão geral e acesso rápido.
- **Agendamento:** Marcação de consultas presenciais e online.
- **Histórico:** Visualização de prontuário e receitas.
- **Telemedicina:** Simulação de videochamada com acesso à câmera real (WebRTC).

### 🩺 Módulo do Profissional de Saúde 
- **Agenda Médica:** Gestão de pacientes do dia.
- **Prontuário Eletrônico:** Registro de evolução clínica.
- **Receita Digital:** Emissão e assinatura digital (simulada).

### ⚙️ Módulo Administrativo 
- **Dashboard de Gestão:** Indicadores de atendimentos e ocupação.
- **Controle de Leitos:** Mapa visual de ocupação hospitalar.
- **Gestão de Usuários:** Controle de cadastros e permissões.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Estrutura semântica e estilização avançada.
- **JavaScript (ES6+):** Lógica de negócio, manipulação de DOM e controle de mídia.
- **Bootstrap 5:** Framework para layout responsivo e componentes UI.
- **LocalStorage:** Banco de dados simulado no navegador (Persistência de dados sem Backend).
- **Google Fonts (Outfit):** Tipografia moderna.
- **Bootstrap Icons:** Ícones vetoriais.

---

## 🔐 Credenciais de Acesso (Dados de Teste)

O sistema já vem populado com usuários de teste para facilitar a avaliação:

| Perfil | E-mail | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| **Paciente** | `paciente@vidaplus.com` | `123` | Acesso a agendamentos e histórico |
| **Médico** | `medico@vidaplus.com` | `123` | Acesso a agenda e prontuários |
| **Admin** | `admin@vidaplus.com` | `123` | Acesso a relatórios e gestão |

---

## 📦 Como Executar o Projeto

### Pré-requisitos
Para que a **câmera (Telemedicina)** funcione corretamente, os navegadores exigem um contexto seguro (HTTPS ou Localhost). **Não abra o arquivo `index.html` diretamente** clicando duas vezes.

### Passo a Passo

1. Acesse o link:
   https://elegant-stardust-fdc1c6.netlify.app/
