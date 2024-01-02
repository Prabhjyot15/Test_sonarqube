/*
 * SonarQube
 * Copyright (C) 2009-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.db.component;

import org.sonar.api.resources.Qualifiers;
import org.sonar.core.util.Uuids;
import org.sonar.db.project.CreationMethod;
import org.sonar.db.project.ProjectDto;

public class ProjectTesting {
  public static ProjectDto newPrivateProjectDto() {
    return newProjectDto(Uuids.createFast(), true);
  }

  public static ProjectDto newPrivateProjectDto(String uuid) {
    return newProjectDto(uuid, true);
  }

  public static ProjectDto newPublicProjectDto() {
    return newProjectDto(Uuids.createFast(), false);
  }

  public static ProjectDto newPublicProjectDto(String uuid) {
    return newProjectDto(uuid, false);
  }

  private static ProjectDto newProjectDto(String uuid, boolean isPrivate) {
    return new ProjectDto()
      .setUuid(uuid)
      .setKey("KEY_" + uuid)
      .setName("NAME_" + uuid)
      .setDescription("DESCRIPTION_" + uuid)
      .setQualifier(Qualifiers.PROJECT)
      .setCreationMethod(CreationMethod.LOCAL_API)
      .setPrivate(isPrivate);
  }

}
