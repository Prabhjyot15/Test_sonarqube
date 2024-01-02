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
import { useTheme } from '@emotion/react';
import { themeColor } from '../../helpers/theme';
import { CustomIcon, IconProps } from './Icon';

export function StatusReopenedIcon({ fill = 'iconStatus', ...iconProps }: IconProps) {
  const theme = useTheme();
  const fillColor = themeColor(fill)({ theme });

  return (
    <CustomIcon {...iconProps}>
      <circle cx="8" cy="8" r="6.25" stroke={fillColor} strokeWidth="1.5" />
      <path
        clipRule="evenodd"
        d="M8 14c3.3137 0 6-2.6863 6-6 0-3.31371-2.6863-6-6-6v12Z"
        fill={fillColor}
        fillRule="evenodd"
      />
    </CustomIcon>
  );
}
