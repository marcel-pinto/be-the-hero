import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../Services/api'

import Logo from '../../Logo'

import './styles.css'

export default function Profile() {
    const [incidents, setIncidents] = useState([]);

    const history = useHistory();
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => setIncidents(response.data));
    },[ongId])

    async function handleDeleteIncident(id) {
        try {
          await api.delete(`incidents/${id}`, {
              headers: {
                  Authorization: ongId
              }
          });
          setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (error) {
            alert("Erro ao deletar o caso, tente novamente.");
        }
    }

    function handleLogout () {
        localStorage.clear();
        history.push('/')
    }
    return (
        <div className="profile-container">
            <header>
                <Logo />
                <span>Bem vinda, {ongName}</span>
                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button type="button">
                    <FiPower onClick={handleLogout} className="link-icon" size={18} />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {incidents.map(ongIncident => (
                    <li>
                        <strong>Caso:</strong>
                        <p>{ongIncident.title}</p>

                        <strong>Descrição</strong>
                        <p>{ongIncident.description}</p>

                        <strong>Valor</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(ongIncident.value)}</p>

                        <button onClick={() => handleDeleteIncident(ongIncident.id)} type="button">
                            <FiTrash2 className="delete-button" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        )
}