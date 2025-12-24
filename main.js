import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

// UI
const ui = document.getElementById('ui');
const scaleSlider = document.getElementById('scaleSlider');
const rotationSlider = document.getElementById('rotationSlider');
const actionBtn = document.getElementById('actionBtn');

// 🔊 Áudio HTML5 (mais simples e confiável)
const audio = new Audio('./assets/audio.mp3');
audio.loop = true;

let model;

async function start() {

  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: './assets/target.mind'
  });

  const { renderer, scene, camera } = mindarThree;

  // Luz
  scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));

  // Anchor
  const anchor = mindarThree.addAnchor(0);

  // Modelo 3D
  const loader = new GLTFLoader();
  loader.load('./assets/model.glb', (gltf) => {
    model = gltf.scene;

    model.scale.set(1, 1, 1);
    model.position.set(0, -0.5, 0);
    model.rotation.set(0, -Math.PI / 2, 0);

    anchor.group.add(model);
  });

  // 🎯 Target encontrada
  anchor.onTargetFound = () => {
    ui.style.display = 'flex';
  };

  // ❌ Target perdida
  anchor.onTargetLost = () => {
    ui.style.display = 'none';

    // Para o áudio se a target sair
    audio.pause();
    audio.currentTime = 0;
    actionBtn.textContent = '🎵 Tocar Música';
  };

  // 🎚️ Escala
  scaleSlider.addEventListener('input', () => {
    if (!model) return;
    const s = parseFloat(scaleSlider.value);
    model.scale.set(s, s, s);
  });

  // 🎚️ Rotação Y
  rotationSlider.addEventListener('input', () => {
    if (!model) return;
    model.rotation.y = parseFloat(rotationSlider.value);
  });

  // 🔘 BOTÃO → TOCAR / PAUSAR ÁUDIO
  actionBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      actionBtn.textContent = '⏸️ Pausar Música';
    } else {
      audio.pause();
      actionBtn.textContent = '🎵 Tocar Música';
    }
  });

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

start();
